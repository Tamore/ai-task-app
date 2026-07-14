import os
import json
import redis
import time
from pymongo import MongoClient
from bson.objectid import ObjectId

REDIS_URI = os.getenv('REDIS_URI', 'redis://localhost:6379')
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/ai-tasks')

def get_redis_connection():
    return redis.Redis.from_url(REDIS_URI)

def get_mongo_collection():
    client = MongoClient(MONGO_URI)
    db_name = MONGO_URI.split('/')[-1].split('?')[0]
    if not db_name:
        db_name = 'ai-tasks'
    db = client[db_name]
    return db['tasks']

def process_operation(input_text, operation_type):
    time.sleep(3) # Simulate heavy AI processing time
    if operation_type == 'Summarize Text':
        words = input_text.split()
        return " ".join(words[:15]) + ("..." if len(words) > 15 else "")
    elif operation_type == 'Sentiment Analysis':
        lower = input_text.lower()
        good_words = ['good', 'great', 'awesome', 'excellent', 'happy', 'love', 'best']
        bad_words = ['bad', 'terrible', 'awful', 'sad', 'hate', 'worst']
        if any(w in lower for w in good_words):
            return "Positive (0.92 confidence)"
        elif any(w in lower for w in bad_words):
            return "Negative (0.87 confidence)"
        return "Neutral (0.55 confidence)"
    elif operation_type == 'Extract Keywords':
        words = [w.strip('.,!?()') for w in input_text.split() if len(w) > 5]
        unique_words = list(set(words))
        return ", ".join(unique_words[:5]) if unique_words else "No significant keywords found"
    elif operation_type == 'Entity Recognition':
        words = input_text.split()
        entities = [w.strip('.,!?()') for w in words if w.strip('.,!?()') and w[0].isupper() and len(w) > 1]
        unique_entities = list(set(entities))
        return "Found Entities: " + ", ".join(unique_entities) if unique_entities else "No entities detected"
    else:
        raise ValueError(f"Unknown operation type: {operation_type}")

def main():
    print("Worker started. Waiting for tasks...")
    r = get_redis_connection()
    tasks_col = get_mongo_collection()
    
    while True:
        try:
            # Block until an item is available in the list
            result = r.brpop('ai-tasks-queue', timeout=0)
            if not result:
                continue
                
            _, data = result
            task_data = json.loads(data.decode('utf-8'))
            
            task_id = task_data['taskId']
            input_text = task_data['inputText']
            operation_type = task_data['operationType']
            
            print(f"Processing task {task_id}: {operation_type}")
            
            # Update status to Running
            tasks_col.update_one(
                {'_id': ObjectId(task_id)},
                {'$set': {'status': 'Running'}}
            )
            
            try:
                # Process the text
                res_text = process_operation(input_text, operation_type)
                
                # Update status to Success
                tasks_col.update_one(
                    {'_id': ObjectId(task_id)},
                    {'$set': {
                        'status': 'Success',
                        'result': res_text,
                        'logs': 'Operation completed successfully.'
                    }}
                )
                print(f"Task {task_id} completed successfully.")
            except Exception as e:
                # Update status to Failed
                tasks_col.update_one(
                    {'_id': ObjectId(task_id)},
                    {'$set': {
                        'status': 'Failed',
                        'logs': f"Error during processing: {str(e)}"
                    }}
                )
                print(f"Task {task_id} failed: {str(e)}")
                
        except Exception as e:
            print(f"Worker error: {str(e)}")

if __name__ == '__main__':
    main()
