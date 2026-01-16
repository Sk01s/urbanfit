# Firebase Storage to Backblaze B2 Migration

This comprehensive solution provides tools to migrate your Firebase Storage media files to Backblaze B2 while updating Firestore documents with the new URLs.

## Features

- **Automated Migration**: Batch process Firestore documents and migrate Firebase Storage URLs to Backblaze B2
- **Error Handling**: Robust retry logic, circuit breaker pattern, and comprehensive error logging
- **Monitoring**: Real-time migration progress tracking and detailed reporting
- **API Endpoints**: Fastify server with REST API for migration management
- **Flexible Upload**: Support for both Firebase Storage and Backblaze B2 for new uploads
- **Resume Capability**: Pause and resume migrations without losing progress
- **Dry Run Mode**: Test migration logic without making actual changes

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Firestore     │    │  Migration Tool  │    │  Backblaze B2   │
│   Documents     │◄──►│  (Node.js)      │◄──►│   Storage       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Fastify API     │
                       │  Server          │
                       └──────────────────┘
```

## Installation

1. **Install dependencies:**
```bash
npm install backblaze-b2 axios form-data @fastify/multipart @fastify/cors fastify
```

2. **Set up environment variables:**
Create a `.env` file in your project root:

```env
# Backblaze B2 Configuration
B2_APPLICATION_KEY_ID=your_b2_application_key_id
B2_APPLICATION_KEY=your_b2_application_key
B2_BUCKET_NAME=your_b2_bucket_name
B2_BUCKET_ID=your_b2_bucket_id  # Optional, will be auto-detected if not provided

# Firebase Configuration (existing)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_firebase_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id

# Migration Configuration
USE_BACKBLAZE_B2_FOR_NEW_UPLOADS=false  # Set to true to use B2 for new uploads
MIGRATION_BATCH_SIZE=10
MIGRATION_MAX_RETRIES=3
MIGRATION_RETRY_DELAY=2000

# Server Configuration
PORT=3001
```

## Usage

### 1. CLI Migration Tool

The migration script provides several commands:

```bash
# Dry run migration for products collection
node scripts/migrate.js migrate products --dry-run

# Migrate products collection (resume from last position)
node scripts/migrate.js migrate products

# Migrate specific documents
node scripts/migrate.js migrate products --ids "prod1,prod2,prod3"

# Start fresh migration (don't resume)
node scripts/migrate.js migrate products --resume false

# Limit number of documents
node scripts/migrate.js migrate products --max-docs 100

# Retry failed migrations
node scripts/migrate.js retry products

# Generate migration report
node scripts/migrate.js report

# Clean up migration status
node scripts/migrate.js cleanup
```

### 2. API Server

Start the Fastify server:

```bash
# Start server
node server.js

# Or with auto-reload for development
node --watch server.js
```

Available API endpoints:

#### Upload Endpoint
```bash
# Upload new image
POST /api/upload
Content-Type: multipart/form-data

# Response
{
  "success": true,
  "url": "https://f002.backblazeb2.com/file/your-bucket/filename.jpg",
  "fileName": "filename.jpg",
  "service": "backblaze",
  "uploadedAt": "2024-01-16T12:00:00.000Z"
}
```

#### Migration Status
```bash
# Check single document migration status
GET /api/migration/status/products/PROD123

# Check bulk migration status
POST /api/migration/status/bulk
Content-Type: application/json
{
  "collection": "products",
  "documentIds": ["PROD123", "PROD456", "PROD789"]
}
```

#### Migration Control
```bash
# Start migration
POST /api/migration/start
Content-Type: application/json
{
  "collection": "products",
  "options": {
    "dryRun": false,
    "maxDocuments": 100
  }
}

# Check migration job status
GET /api/migration/status/migration-1234567890

# Retry failed migrations
POST /api/migration/retry
Content-Type: application/json
{
  "collection": "products"
}

# Get migration statistics
GET /api/migration/stats?collection=products

# Generate migration report
GET /api/migration/report
```

### 3. Firebase Service Integration

The Firebase service has been updated to support both storage providers:

```javascript
// Upload to Firebase Storage (default)
const url = await firebase.storeImage(id, folder, imageFile);

// Upload to Backblaze B2
const url = await firebase.storeImage(id, folder, imageFile, true);

// Or use environment variable to control default behavior
// USE_BACKBLAZE_B2_FOR_NEW_UPLOADS=true in .env file
const url = await firebase.storeImage(id, folder, imageFile); // Will use B2
```

### 4. Migration Status Checking

```javascript
// Check if a document needs migration
const status = await firebase.getDocumentMigrationStatus('products', 'PROD123');

console.log(status);
// {
//   exists: true,
//   documentId: 'PROD123',
//   collectionName: 'products',
//   needsMigration: true,
//   totalFirebaseUrls: 3,
//   totalBackblazeUrls: 0,
//   storageUrls: [...]
// }
```

## Migration Process

1. **Document Scanning**: The tool scans Firestore documents for Firebase Storage URLs
2. **File Download**: Downloads files from Firebase Storage
3. **B2 Upload**: Uploads files to Backblaze B2 with new filenames
4. **Document Update**: Updates Firestore documents with new B2 URLs
5. **Metadata Tracking**: Adds migration metadata to track progress

## Error Handling

The migration tool includes comprehensive error handling:

- **Retry Logic**: Automatic retry with exponential backoff
- **Circuit Breaker**: Prevents cascading failures
- **Error Classification**: Distinguishes between retryable and non-retryable errors
- **Monitoring**: Real-time error tracking and reporting
- **Graceful Degradation**: Continues migration even if individual documents fail

## Monitoring and Reporting

The system provides detailed monitoring:

- **Progress Tracking**: Real-time migration progress
- **Error Statistics**: Categorized error reporting
- **Performance Metrics**: Migration speed and success rates
- **Recommendations**: Automated suggestions for improvement

## Best Practices

1. **Start with Dry Run**: Always test with `--dry-run` first
2. **Batch Processing**: Use appropriate batch sizes (default: 10)
3. **Monitor Progress**: Check migration status regularly
4. **Handle Failures**: Use retry mechanisms for failed documents
5. **Backup Data**: Ensure Firestore backups before migration
6. **Test Thoroughly**: Verify migrated URLs work correctly

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify B2 application key and Firebase credentials
2. **Rate Limiting**: Reduce batch size or add delays
3. **Network Timeouts**: Increase retry delays and timeout values
4. **Storage Quota**: Check Backblaze B2 storage limits

### Error Types

- **Network Errors**: Temporary connectivity issues (auto-retried)
- **Authentication Errors**: Invalid credentials (not retried)
- **Rate Limiting**: Too many requests (auto-throttled)
- **File Not Found**: Missing source files (logged for manual review)

## Security Considerations

- Store credentials in environment variables, not in code
- Use least-privilege IAM roles for both Firebase and B2
- Implement proper CORS settings for the API server
- Validate file types and sizes before upload
- Monitor for unusual migration patterns

## Performance Optimization

- Use appropriate batch sizes based on your network speed
- Implement circuit breaker for handling service outages
- Monitor and adjust retry delays based on error patterns
- Consider running migration during off-peak hours
- Use parallel processing for independent operations

## Support

For issues and questions:
1. Check the migration logs and error reports
2. Review the monitoring recommendations
3. Verify environment configuration
4. Test with small batches first
5. Check service status for Firebase and Backblaze B2