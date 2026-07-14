# AI Task Processing Platform - Architecture Document

## 1. Overall System Architecture
The AI Task Processing Platform is designed as a decoupled, microservices-based distributed system to ensure high availability, fault tolerance, and scalable asynchronous processing. 

### Core Components:
- **Frontend (Next.js 14+)**: A server-side rendered (SSR) and statically generated React application using the App Router. It communicates with the backend via RESTful APIs and utilizes a modern, mobile-responsive Tailwind CSS interface.
- **Backend API (Node.js & Express)**: A lightweight API gateway handling stateless user authentication via JWT, rate limiting, and request validation. It interfaces with MongoDB for persistence and Redis for task queuing.
- **Message Broker (Redis)**: Functions as the in-memory queue separating the fast frontend API from the slow background processing. By decoupling task ingestion from execution, the system prevents API timeouts and bottlenecks.
- **Background Worker (Python 3)**: A dedicated processing node that pulls tasks from Redis using `BRPOP` (blocking pop) to ensure zero-latency overhead polling. It simulates heavy AI operations and directly updates the task status in MongoDB upon completion.
- **Database (MongoDB)**: The primary persistent storage layer containing collections for `Users` and `Tasks`.

## 2. Worker Scaling Strategy
To maintain processing efficiency during traffic spikes, the Python Worker service is designed to scale horizontally using Kubernetes (k3s).

### Horizontal Pod Autoscaling (HPA)
- The worker deployment is bound to a Kubernetes `HorizontalPodAutoscaler`.
- **Scaling Metric**: The HPA monitors the Redis queue length (via custom metrics) and CPU/Memory utilization of the worker pods.
- **Execution**: As the queue depth increases, Kubernetes dynamically spins up additional worker pods. Because the workers are stateless and use `BRPOP`, they can concurrently consume tasks from the shared Redis queue without race conditions or duplication.
- Once the queue size normalizes, the HPA scales the pods back down to the minimum configured threshold to conserve cluster resources.

## 3. Handling High Task Volume (100,000 Tasks/Day)
At 100,000 tasks per day, the system processes approximately 1.15 tasks per second on average. However, assuming peak hour spikes (e.g., 50 tasks/second), the architecture employs several safeguards:

- **Ingestion Buffering**: The Node.js backend can handle thousands of requests per second. It rapidly writes the task metadata to MongoDB, pushes the job payload to Redis (which operates in memory and can handle >100k operations/second), and immediately returns a `201 Created` response to the client. The client is never blocked waiting for execution.
- **Stateless Concurrency**: By spinning up 10-20 lightweight Python worker pods during peak times, the system can process hundreds of tasks concurrently.
- **Pagination & Caching**: The dashboard API strictly paginates task fetches and utilizes index-backed queries to prevent database locking when users query their historical data.

## 4. MongoDB Indexing Strategy
To ensure database queries remain highly performant as the `Tasks` collection grows into millions of records, specific compound and single-field indexes are applied:

1. **User Query Index**: `db.tasks.createIndex({ user: 1, createdAt: -1 })`
   - **Rationale**: The dashboard primarily queries tasks belonging to a specific user, sorted by the most recent first. This compound index ensures `find({ user: userId }).sort('-createdAt')` operates in `O(log N)` time.
2. **Status Index**: `db.tasks.createIndex({ status: 1 })`
   - **Rationale**: Useful for administrative queries or cleanup jobs that need to find all `Pending` or `Failed` tasks.
3. **Authentication Index**: `db.users.createIndex({ username: 1 }, { unique: true })`
   - **Rationale**: Ensures rapid O(1) lookups during the login process and enforces username uniqueness at the database level.

## 5. Redis Failure Handling and Recovery Strategy
As the critical messaging bridge, Redis requires a robust failure strategy:

- **Persistence Configuration**: Redis is configured with both RDB (snapshotting) and AOF (Append-Only File) persistence. If the Redis pod crashes, it can restore the unacknowledged queue state from disk upon restart.
- **Reliable Queues (RPOPLPUSH / BRPOPLPUSH)**: Instead of a simple `BRPOP` (which destroys the message upon popping), the workers implement the reliable queue pattern. Tasks are atomically popped from the main queue and pushed into a `processing_queue`. If a worker pod crashes mid-execution, a cleanup script identifies stalled tasks in the `processing_queue` and pushes them back to the main queue for retry.
- **Kubernetes Liveness Probes**: K8s continuously monitors the Redis service. If the pod becomes unresponsive, it is automatically restarted.

## 6. Deployment Strategy

### Staging Environment
- **Purpose**: A pre-production replica for QA, testing, and stakeholder approval.
- **Trigger**: Pushes or Pull Requests to the `staging` branch.
- **Infrastructure**: Deployed in a separate isolated Kubernetes namespace (`ai-task-staging`).
- **Data**: Uses a sanitized, scaled-down staging database to prevent accidental production data mutation.
- **Argo CD**: Configured to auto-sync the staging branch manifests to the staging namespace.

### Production Environment
- **Purpose**: The live, user-facing application.
- **Trigger**: Merges to the `main` branch.
- **Infrastructure**: Deployed in the primary `ai-task-prod` Kubernetes namespace.
- **Scaling**: HPA limits are set significantly higher than staging to accommodate real-world traffic. High availability is achieved using multi-node pod anti-affinity.
- **Argo CD**: Auto-sync is enabled. Changes to the `ai-task-infra` repository's `main` branch are instantly reconciled to the production cluster, ensuring immutable, declarative infrastructure management.
