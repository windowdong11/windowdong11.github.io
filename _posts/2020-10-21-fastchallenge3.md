---
title: "[패스트캠퍼스 수강 후기] 알고리즘 / 기술면접👉코딩테스트인강 100% 환급챌린지 3회차 미션
"
date: 2020-10-21 23:20:00 +0400
categories: fastcampus-challenge DataStructure-Note
toc : true
---
# 학습기록

## 오늘 들은 강의 목록

10. 스택  
11. 링크드 리스트 - 1  
12. 링크드 리스트 - 2  
13. 링크드 리스트 - 3  
14. 링크드 리스트 - 4  

# 스택


## 특징

가장 늦게 들어간 것이 가장 먼저나오는 LIFO(Last In First Out)의 성격을 지님(이렇게 잘 안부르긴 함)  

## 현실 속 스택 - 프링글스

현실에서 프링글스가 스택의 대표적인 예가 아닐까?
프링글스를 포장할때 가장 늦게넣은 칩이 가장 먼저 나오니까

## 용어

![스택](/assets/images/fastchallenge/day3/stack.PNG)

+ Push  
push는 스택에 요소를 집어넣는다.
+ Pop  
pop은 스택에서 요소를 꺼낸다.

## 리스트를 이용한 스택 구현

```py
stack = []
stack.append(1)
stack.append(2)
print(stack.pop())
print(stack.pop())
```

스택 구현은 파이썬의 리스트에서 기본적으로 지원하는 메소드를 통해서 간단하게 구현할 수 있다.  
push는 append로, pop는 그대로 pop를 사용하면 된다.  

## 컴퓨터에서 스택의 활용

프로세스 스택 구조를 위해 사용한다.  
```py
def func1():
    print("start f1")
    func2()
    print("end f1")
def func2():
    print("start f2")
    print("end f2")

def main():
    func1()

main()
```
main에서 func1()으로 가며 마지막 다음 코드 실행위치를 push한다.  
func1에서 "start f1"을 출력하고, func2를 호출하며 다음 코드 실행위치를 push한다.  
func2에서 "start f2", "end f2"를 출력한다.  
func2 함수가 끝났으므로 스택에서 다음 코드 실행위치를 pop한다.  
func1에서 "end f1"을 출력한다.
func1 함수가 끝났으므로 스택에서 다음 코드 실행위치를 pop한다.
main 함수가 끝났고, 스택에서 다음 코드 실행위치가 없으므로 프로그램을 종료한다.

이런 코드를 어셈블리어로 된걸 보면 명확하게 보인다.  
visual studio에서 c등으로 위와 같은 코드를 작성해서 디스어셈블해보면 가장 보기 간단하다.

## 스택의 장점

+ 구조가 단순해서 구현하기 쉽다.  
+ 데이터 저장, 읽기 속도가 빠르다.

## 스택의 단점

+ 데이터의 최대 갯수를 미리 정해야한다. (메모리공간을 예약해야한다.)
+ 위의 단점으로 인해 공간적인 낭비가 발생한다.

일반적으로 스택은 단순함과 빠른 성능을 위해 사용하기때문에 이러한 단점에도 적절한 크기의 공간을 할당해서 사용하는 듯하다.  
(동적으로 구현해서 해결할 수는 있겠지만 굳이? 이런느낌)

# 연결 리스트 (linked list)

데이터가 다음 데이터를 연결하는 구조를 띄어서 연결리스트라고 한다.  

## 구조

![노드](/assets/images/fastchallenge/day3/연결리스트노드.PNG)  
위 사진처럼 연결리스트는 연결된 형태를 띄게되는데,  
각 데이터는 다음 데이터를 연결하고 있다.  
따라서, 각 데이터는 두가지 정보를 가지는데 "데이터"와 "다음 데이터의 주소"이다.  
이 두가지 정보를 가진 데이터를 "노드"라고한다.
즉, 연결리스트는 노드들이 연결된 구조를 나타낸다.

주소는 그 데이터의 위치를 나타낸다.  
주소를 통해 데이터를 찾을 수 있다.

## 장점

+ 공간을 정하지 않아도 된다.  
+ 공간적인 낭비가 없다.  
+ 삽입, 삭제할때 시간이 적게든다.

## 단점

+ 구현하기가 어렵다.
+ 데이터 접근속도가 느리다.

## 구현

```py
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        
class Llist:
    def __init__(self, head=None):
        self.head = head
        self.size = 1 if head else 0
        self.pointer = self.head
        
    def Next(self):
        if self.pointer != None and self.pointer.next != None:
            self.pointer = self.pointer.next
            return self.pointer
    
    def Head(self):
        self.pointer = self.head
        
    def Add(self, node):
        self.size += 1
        if self.head == None:
            self.head = node
            self.pointer = self.head
        else:
            node.next = self.pointer.next
            self.pointer.next = node
            
            
    def Delete(self):
        if self.size != 0:
            if self.head == self.pointer:
                self.head = self.head.next
                del self.pointer
                self.pointer = self.head
            else:
                node = self.head
                while node.next != self.pointer:
                    node = node.next
                node.next = self.pointer.next
                del self.pointer
                self.pointer = node
            self.size -= 1
        
    def Print(self):
        if self.head != None:
            curnode = self.head
            while curnode:
                print(curnode.data)
                curnode = curnode.next

llist = Llist()
llist.Delete() # 예외처리 테스트
llist.Next() # 예외처리 테스트
llist.Add(Node(0))
llist.Next()
llist.Add(Node(1))
llist.Next()
llist.Head()
llist.Add(Node(2))
llist.Print() # 0 2 1
```

간단하게 data와 next를 포함하는 node를 작성하고,  
node를 이용해서 단일연결리스트(single linked list)를 작성했다.

head와 pointer를 사용하는 연결리스트다.  
head는 Add/Delete 할 때 외에는 변하지 않는다.  
head는 최상위 노드를 가리키고, pointer는 탐색을 위한 노드를 가리키는 포인터다.  

메소드는 다음과 같이 정해놓고 구현했다.
>Add(Node) : pointer의 다음위치에 노드를 추가한다.  
>Delete() : pointer위치의 노드를 제거한다.  
>Next() : pointer를 다음위치로 이동한다.  
>Head() : pointer를 head위치로 이동한다.

## 여러가지 연결리스트 종류들

+ 단일 연결리스트(single linked list) : 다음 노드를 가리키는 노드 사용 (단일, 단방향 등으로 부름)
+ 양방향 연결리스트(double linked list) : 이전 다음 노드를 모두 가리키는 노드 사용
+ 원형 연결리스트(circular linked list) : 원형으로 이루어진 연결리스트
+ 더미 연결리스트(dummy linked list) : 더미 노드를 추가해서 사용

## 단일 연결리스트 (single linked list)

![단일](/assets/images/fastchallenge/day3/연결리스트노드.PNG)  
맨 처음 본 사진이자 방금 구현한 단일 연결리스트이다.  
단방향 연결리스트라고도 부른다.

> 장점 : 연결리스트 중 가장 구현하기 쉽다.
> 단점 : 노드를 삽입/삭제하는데 굉장히 느리다.

## 양방향 연결리스트 (double linked list)

![양방향](/assets/images/fastchallenge/day3/양방향노드.PNG)  
단방향 연결리스트에 이전 노드의 주소가 추가된 형태이다.

> 장점 : 이전노드로 돌아갈 수 있어서 노드를 삽입/삭제하는데 굉장히 빠르다.
> 단점 : 구현하기 복잡하다.


# 내가 듣는 인강
**알고리즘 / 기술면접👉https://bit.ly/2FgOONG**