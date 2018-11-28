# Zadanie 1: Stos
# Push()
# Peek()
# Pop()
# Length()

print("\n-= STACK =-")

class Node:
    value = 0
    lowerNode = None
    def __init__(self, v):
        self.value = v
    
    def length(self):
        if self.lowerNode is not None:
            return self.lowerNode.length() + 1
        else:
            return 0
    def asList(self, l): # Just to check the contents, no functions in excersise refer to this function
        l.append(self.value)
        if self.lowerNode is not None:
            self.lowerNode.asList(l)
		
class Stack:
    topNode = None

    def Push(self, value):
        n = Node(value)
        if self.topNode is not None:
            n.lowerNode = self.topNode
        self.topNode = n

    def Peek(self):
        if self.topNode is None:
            return None
        else:
            return self.topNode.value

    def Pop(self):
        if self.topNode is None:
            return None
        else:
            n = self.topNode
            self.topNode = self.topNode.lowerNode
            return n.value

    def Length(self):
        if self.topNode is None:
            return 0
        else:
            return self.topNode.length() + 1

    def AsList(self):
        l = []
        if (self.topNode is not None):
            self.topNode.asList(l)
        return l

s = Stack()

print("Peek:", s.Peek())
print("Length:", s.Length())
s.Push("Hello")
s.Push("there")
s.Push("my")

print("Pop:", s.Pop())
print("Peek:", s.Peek())
print("Length:", s.Length())
s.Push("friend")
s.Push("!")

print("As List:", s.AsList())

print("Length:", s.Length())

print("Peek:", s.Peek())
print("Peek:", s.Peek())
print("Pop:", s.Pop())
print("Pop:", s.Pop())
print("Pop:", s.Pop())
print("Pop:", s.Pop())
print("Pop:", s.Pop())
print("Pop:", s.Pop())
print("Length:", s.Length())
print("As List:", s.AsList())