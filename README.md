Notes to self:  
- Improper use of polymorphism on `Message` items. These should use a virtual `handle(Server *server)` method rather than an if chain.  
- Didn't correctly encapsulate Redis logic in a `Gateway`.  
- Sloppy class method definition, particularly public versus private. (TypeScript supports private and protected, as well as abstract!)  