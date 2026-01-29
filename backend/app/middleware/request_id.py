from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import uuid
import logging
import time

logger = logging.getLogger("middleware")

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Add to logging context if we were using a structlog/contextual logger
        # For now, we'll just log manually
        
        start_time = time.time()
        logger.info(f"Request started", extra={"request_id": request_id, "path": request.url.path, "method": request.method})
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        response.headers["X-Request-ID"] = request_id
        
        logger.info(f"Request finished", extra={
            "request_id": request_id, 
            "status_code": response.status_code, 
            "duration": f"{process_time:.4f}s"
        })
        
        return response
