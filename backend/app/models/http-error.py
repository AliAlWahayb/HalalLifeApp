class HttpError(Exception):  
    def __init__(self, message, error_code):
        super().__init__(message)  
        self.code = error_code     