# myapp/tainting/context_managers.py

from .taint import Tainted  # Importing the Tainted class

tainted_registry = {}

class TaintContext:
    def __enter__(self):
        # Any setup needed when entering the context
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Cleanup or final checks when exiting the context
        pass

    def taint(self, name, value):
        return Tainted(name, value)
