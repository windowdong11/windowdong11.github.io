---
title: "👉자료구조/알고리즘 - 6"
date: 2020-10-24 17:20:00 +0400
categories: fastcampus-challenge DataStructure-Note
toc : true
usemathjax: true
---
# 학습기록
## 오늘 들은 강의 목록
22. 트리 - 1
23. 트리 - 2
24. 트리 - 3
24. 트리 - 4
24. 트리 - 5

와.. 웬만해서 하루에 한 주제씩 끝내려고했는데  
트리가 8강이나 있다..  
이틀에 나눠서 해야겠다.

## 트리

나무처럼 가지에 잎이 딸린 형태로 트리라고 한다.  
Node와 Branch(간선, edge)를 이용해서 사이클이 구성되지 않도록 형성된 구조

주로 이진트리 형태로 탐색알고리즘에 많이 사용된다.

## 용어

+ 노드(Node) : 데이터를 저장하는 요소  
+ 최상위 노드(Root Node) : 트리의 맨 위에 있는 노드
+ 레벨(Level) : 각 노드의 깊이를 나타낸다. 최상위 노드의 레벨은 0, 하위 node로 갈때마다 1씩 증가한다.
+ 깊이(Depth) : 최하위 노드의 레벨
+ 자식 노드(Child Node) : 어떤 노드에 연결된 다음 레벨의 노드
+ 부모 노드(Parent Node) : 어떤 노드에 연결된 이전 레벨의 노드
+ 잎 노드(Leaf Node) : 자식이 없는 노드
+ 형제(Siblings) : 같은 부모를 가진 노드들 (사진에서 3과 6은 형제관계이다.)

![tree](/assets/images/fastchallenge/day6/tree.png)

## 이진 트리(Binary Tree)

> 자식을 최대 두개갖는 트리

## 이진 탐색 트리(Binary Search Tree, BST)

> 자식을 최대 두개갖는 이진트리의 특징을 가지고,  
> 왼쪽 자식노드는 현재 노드보다 작은 값,  
> 오른쪽 자식노드는 현재 노드보다 큰 값을 가지는 구조를 띄는 트리.

용도 : 데이터 검색
장점 : 탐색 속도 개선
단점 : 복잡하다.

```py
class BinaryNode:
    def __init__(self, value):
        self.value = value
        self.left = None # 좌측 자식을 없음으로 초기화
        self.right = None # 우측 자식을 없음으로 초기화
class BinaryTree:
    def __init__(self, head = None):
        self.head = head
```

## 이진탐색트리에서 데이터 삽입

1. BST에 최상위 노드가 없는 경우 최상위 노드에 데이터를 삽입하고 종료한다.
2. 최상위 노드부터 탐색을 시작한다.  
3. 현재 노드의 값보다 삽입하려는 값이 작다면 왼쪽 노드부터 다시 탐색을 시작하고,  
현재 노드의 값보다 삽입하려는 값이 크다면 오른쪽 노드부터 다시 탐색을 시작한다.
4. 다음 탐색위치에 노드가 없을때까지 2번을 반복한다.
5. 다음 탐색위치에 데이터를 삽입한다.

```py
def insert(self, value):
    if self.head == None:
        self.head = Node(value)
        return
    current_node = self.head
    while True:
        if value < current_node.value:
            if current_node.left == None:
                current_node.left = Node(value)
                return
            else:
                current_node = current_node.left
        else:
            if current_node.right == None:
                current_node.right = Node(value)
                return
            else:
                current_node = current_node.right
```

## 이진탑색트리에서 데이터 탐색

1. 최상위 노드부터 탐색을 시작한다.
2. 현재 노드의 값보다 삽입하려는 값이 작다면 왼쪽 노드부터 다시 탐색을 시작하고,  
현재 노드의 값보다 삽입하려는 값이 크다면 오른쪽 노드부터 다시 탐색을 시작한다.
3. 값을 찾을 때까지 탐색을 계속한다.
4. 값을 찾았다면 True를 반환한다. (이런 경우 반복문 내에서 값을 찾았을 것이다. -> 반복문 내에 작성)
5. 값을 찾지 못한 경우 False를 반환한다. (이런 경우 반복문이 종료되었을 것이다. -> 함수 종료시에 작성)

```py
def search(self, value):
    current_node = self.head
    while current_node:
        if current_node.value == value:
            return True
        elif value < current_node.value:
            current_node = current_node.left
        else:
            current_node = current_node.right
```

## 이진탑색트리에서 데이터 삭제

데이터 삭제는 BST구현에서 가장 복잡한 부분이다.  
데이터 삭제는 여러가지 케이스로 나눠서 구현하는 것이 덜 복잡하다.  

노드를 삭제하기 위해서는 해당 노드의 자리에 들어갈 다른 노드와 해당 노드의 부모 노드를 이어줘야 하기 때문에 노드를 탐색하면서 부모 노드 또한 따로 저장해놔야한다.  
또, 탐색코드와는 조금 다르게 찾았는지 존재여부또한 저장해둬야 한다.  

1. 삭제할 노드가 없는 경우  

False를 리턴해준다.  
존재여부를 확인해서 간단하게 처리할 수 있다.  

2. 삭제하고자 하는 노드에 자식이 없는 경우(Leaf Node)  
해당 노드를 삭제하고 부모 노드에서 해당 노드를 가리키는 부분을 None등으로 초기화해줘야한다.  
이것 또한 간단하게 처리할 수 있다.  

![removeleaf](/assets/images/fastchallenge/day6/tree_remove_leaf_code.png)

3. 삭제하고자 하는 노드의 자식이 하나만 존재하는 경우  
현재 노드의 위치를 현재노드의 자식노드로 변경해주면 된다.  
이것 또한 간단하게 처리할 수 있다.  
(다만, 현재 노드가 부모 노드의 왼쪽 자식인지 오른쪽 자식인지에 따라서만 처리하면 된다. 실수조심!)  
![1child](/assets/images/fastchallenge/day6/tree_remove_1child_code.png)

4. 삭제하고자 하는 노드의 자식이 둘다 존재하는 경우(가장복잡)  
BST의 구현이 복잡하다고 하는 이유이다.  
두가지 방법이 존재하는데,  
+ 현재노드의 좌측 자식노드를 루트로 하는 트리에서 가장 큰 값을 현재 노드의 위치에 변경
+ 현재노드의 우측 자식노드를 루트로 하는 트리에서 가장 작은 값을 현재 노드의 위치에 변경

![2child](/assets/images/fastchallenge/day6/tree_remove_2child_code_right.png)

## 일부 구현

아래는 데이터 삽입, 탐색을 구현한 코드

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
class BST:
    def __init__(self, head = None):
        self.head = head
    
    def insert(self, value):
        if self.head == None:
            self.head = Node(value)
            return
        current_node = self.head
        while True:
            if value < current_node.value:
                if current_node.left == None:
                    current_node.left = Node(value)
                    return
                else:
                    current_node = current_node.left
            else:
                if current_node.right == None:
                    current_node.right = Node(value)
                    return
                else:
                    current_node = current_node.right
                    
    def search(self, value):
        current_node = self.head
        while current_node:
            if current_node.value == value:
                return True
            elif value < current_node.value:
                current_node = current_node.left
            else:
                current_node = current_node.right
```

완전한 구현은 다음 포스팅에 하도록 하겠다.