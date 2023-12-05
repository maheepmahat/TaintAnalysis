# myapp/tainting/taint.py
import csv
from datetime import datetime

class Tainted:
    # Class-level dictionary to store changes for all instances
    changes = {}

    def __init__(self, name, value):
        object.__setattr__(self, 'name', name)
        object.__setattr__(self, 'value', value)
        object.__setattr__(self, 'is_tainted', True)
        self.log_change(value)  # Log the initial value

    def log_change(self, new_value):
        # Aggregate changes in the class-level dictionary
        if self.name not in Tainted.changes:
            Tainted.changes[self.name] = []
        Tainted.changes[self.name].append((datetime.now(), new_value))

    #to intercept any assignment to attributes of an object
    def __setattr__(self, key, value):
        if key == 'value':
            self.log_change(value)  # Log when the 'value' is changed
        object.__setattr__(self, key, value)

    #invoked before looking at the actual attributes on the object.
    def __getattribute__(self, item):
        # Log access to 'value' attribute
        if item == 'value':
            value = object.__getattribute__(self, item)
            self.log_change(value)
            return value
        else:
            return object.__getattribute__(self, item)

    def __str__(self):
        return str(self.__getattribute__('value'))
