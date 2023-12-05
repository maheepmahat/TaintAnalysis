# myapp/tainting/decorators.py
from .taint import Tainted

def taint_return(name="return_value"):
    def decorator(func):
        def wrapper(*args, **kwargs):
            value = func(*args, **kwargs)
            return Tainted(name, value)
        return wrapper
    return decorator
