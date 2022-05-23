---
title: "👉자료구조/알고리즘 - 7"
date: 2020-10-25 20:20:00 +0900
categories: fastcampus-challenge DataStructure-Note
toc : true
usemathjax: true
---
# 학습기록
## 오늘 들은 강의 목록

27. 트리 - 6
28. 트리 - 7
29. 트리 - 8
30. 힙 - 1
31. 힙 - 2

## 트리 구현 (루트 삭제 안됨)

트리 구현을 어느정도 하긴 했는데
삭제하는 부분에서 문제가 발생했다.
Root 노드 삭제가 정상적으로 되지 않았다.
아래 코드는 루트 삭제가 정상적으로 되지 않는 코드다.
다시 한번 구현을 해봐야겠다.

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
                
    def delete(self, value):
        current_node = self.head # 삭제하려는 노드
        parent_node = self.head # 삭제할 노드의 부모노드
        found = False
        while current_node:
            if current_node.value == value:
                found = True
                break
            parent_node = current_node
            if value < current_node.value:
                current_node = current_node.left
            else:
                current_node = current_node.right
        if found:
            if current_node.left and current_node.right:
                if current_node.right.left:
                    #left의 좌측값
                    change_node_parent = current_node.right # 삭제하려는 노드의 위치에 올 노드의 부모
                    change_node = current_node.right # 삭제하려는 노드의 위치에 올 노드
                    while change_node.left:
                        change_node_parent = change_node
                        change_node = change_node.left
                    if change_node.right:
                        change_node_parent.left = change_node.right
                        change_node.right = None
                    else:
                        change_node_parent.left = None
                    parent_node.right = change_node
                    change_node.right = current_node.right
                    del current_node
                else:
                    current_node.right.left = current_node.left
                    if parent_node.left == current_node:
                        parent_node.left = current_node.right
                    else:
                        parent_node.right = current_node.right
            elif current_node.left: # 좌측에만 자식노드 존재
                if parent_node.left == current_node:
                    parent_node.left = current_node.left
                else:
                    parent_node.right = current_node.left
                    
            elif current_node.right: # 우측에만 자식노드 존재
                if parent_node.left == current_node:
                    parent_node.left = current_node.right
                else:
                    parent_node.right = current_node.right
                    
            else: # 자식노드 없음
                if parent_node.left == current_node:
                    parent_node.left = None
                else:
                    parent_node.right = None
            del current_node
            
            
                
    def printbfs(self): # 너비탐색을 이용한 방법
        queue = []
        queue.append(self.head)
        while len(queue):
            cur = queue.pop(0)
            if cur.left:
                queue.append(cur.left)
            if cur.right:
                queue.append(cur.right)
            print(cur.value)
            
                
                
tree = BST()
tree.insert(10)
tree.insert(5)
tree.insert(7)
tree.insert(3)
tree.insert(14)
tree.insert(12)
tree.insert(15)
print(tree.search(10))
print(tree.search(5))
print(tree.search(7))
print(tree.search(3))
print(tree.search(14))
print(tree.search(12))
print(tree.search(15))
#tree.delete(10) 루트삭제 안됨
tree.delete(5)
tree.delete(3)
tree.delete(7)
tree.delete(14)
tree.printbfs()
```

## BST에서 시간 복잡도 (평균, 최선)  

탐색할때의 시간복잡도는 depth에 영향을 받는다.  
어떤 트리의 depth를 d라고할때, $O(d)$가 된다.  

트리에 노드가 n개 있을때 가장 이상적인 상황은 높이가 $log_2 n$인데,  
이런 경우를 생각해서 평균 시간복잡도는 $O(log n)$이라고 한다.  
(TMI : 빅오 표기법에서 log의 밑은 2이다.)  
이렇게 트리가 균형을 이루는 상태를 완전 이진트리, 균형 트리라고 한다.  

![bst애니메이션](/assets/images/fastchallenge/day7/bst-animation.gif)  
위 그림에서 처럼 높이에 영향을 받는다.  

## BST에서 시간 복잡도 (최악)  

![최악](/assets/images/fastchallenge/day7/bst_worst.png)  
바로 입력되는 값이 항상 가장 크거나 작은 값이 입력될때이다.  
위 그림은 계속해서 큰 값이 입력되어 깊이가 n이 된 케이스이다.  
이러한 경우 시간복잡도가 $O(n)$이 된다.  
균형을 이루지 않는 상태를 불균형 이진 트리하고, 한쪽에 치우친 트리를 편향 트리라고 한다.  
이를 해결하기 위한 알고리즘들이 존재하며 AVL트리, B트리 등이 있다.  

## 힙(Heap)

트리에서 변형(확장)된 구조
데이터에서 최대값과 최소값을 지우기 위한 완전 이진트리  
완전 이진트리 : 노드를 삽입할 때 최하단 왼쪽 노드부터 차례대로 삽입하는 트리  
(차례대로 삽입하기 때문에 한쪽으로 치우치거나 하지 않고 균형적인 형태를 띈다.)

## 힙을 사용하는 이유

배열에서 데이터에서 최소값과 최대값을 찾으려면 $O(n)$이 걸리기 때문  
힙은 $O(log n)$이면 됨.  
우선순위 큐처럼 최대값 또는 최소값을 빠르게 찾아야 하는 자료구조 및 알고리즘에 많이 활용됨

## 힙의 구조

최대 힙(Max Heap)과 최소 힙(Min Heap)으로 분류됨.  

+ 최대 힙  
각 노드는 자식노드들보다 크거나 같은 값을 가진다.  
따라서 루트노드가 가장 큰 값을 가진다.  
+ 최소 힙  
각 노드는 자식노드들보다 작거나 같은 값을 가진다.  
따라서 루트노드가 가장 작은 값을 가진다.  

## 힙 데이터 삽입

1. 최하단 왼쪽에 데이터를 삽입한다.  
2. 부모노드와 비교해서 현재 값이 더 크다면 서로 바꾼다.(swap)
3. 부모노드의 값이 현재 값보다 더 클때까지 반복한다.

![힙삽입](/assets/images/fastchallenge/day7/heap_insert.png)  
그림에서 20을 삽입한 과정을 보면,  

1. 20을 최하단 왼쪽에 삽입한다.  
2. 해당 노드의 부모(8)와 비교해서 20이 더 크므로 서로 바꾼다.
3. 해당 노드의 부모(15)와 비교해서 20이 더 크므로 서로 바꾼다.
4. 부모 노드가 없으므로 종료한다.

## 힙 데이터 삭제

힙의 데이터 삭제는 루트 노드를 삭제하는 것이 일반적이다.  
(힙의 본래 용도가 최소값과 최대값을 빠르게 꺼내 쓸 수 있도록 하기 위한 것이기 때문)  
삭제 과정은 아래와 같다.  

1. 최상단 노드를 삭제한다.  
2. 가장 마지막으로 추가한 노드(최하단 오른쪽 노드)를 최상단 노드로 옮긴다.  
3. 최상단 노드와 자식 노드와 비교해서 자식노드 중 더 큰 노드와 swap한다.  
4. 아래로 이동한 노드(이전 최상단 노드)와 자식노드 중 큰 노드와 swap한다.  
5. 더 이상 이동할 수 없을때까지 4를 반복한다.

![힙삭제](/assets/images/fastchallenge/day7/heap_remove.png)

## 마지막

구현은 내일하기로~  