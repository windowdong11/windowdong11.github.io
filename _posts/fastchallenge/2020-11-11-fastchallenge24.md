---
title: "자료구조/👉알고리즘 - 24"
date: 2020-11-11 21:00:00 +0900
categories: fastcampus-challenge DataStructure-Note Algorithm-Note
toc : true
usemathjax: true
---
## 오늘 들은 강의 목록

1. Union Find
2. 크루스칼 - 1 : Union-by-Rank

## Union Find 최적화

[기존 Union Find 포스트](https://windowdong11.github.io/algorithm/union-find/Union-Find/)

![worst](/assets/images/fastchallenge/day24/worst.png)  
![최악](/assets/images/fastchallenge/day24/최악.PNG)

저번 포스트에서 최악의 경우를 구현하기 까지 했다.  
이제 이런 최악의 경우를 해결하기 위한 최적화 기법 두가지를 소개하겠다.  

1. union-by-rank
2. path-compression : 경로압축

## Union함수에서 최적화 : union-by-rank

각 높이별로 랭크를 부여하여, Union할 때 두 집합의 최대 노드를 비교하고,  
더 높은 랭크를 가진 집합에 낮은 랭크를 가진 집합을 붙이는 방법.  

시간복잡도 : 최악의 경우에서 leaf노드(최하위 노드)를 이용해 union/find연산의 경우 높이가 $N$이라서 $O(N)$의 시간복잡도를 가지는데,  
이 방법을 이용하면 최악의 경우에도 높이가 $log N$으로 $O(log N)$의 시간복잡도를 가지게 된다.

> 1. 두 집합 A, B에서 한 집합의 랭크가 **높은** 경우,  
> 랭크가 높은 집합에 낮은 집합을 붙인다.
> 2. 두 집합 A, B에서 두 집합의 랭크가 **같은** 경우,  
> 한 집합의 랭크를 올리고, 다른 집합을 붙인다.

![union](/assets/images/fastchallenge/day24/unionbyrank.png)

## union-by-rank 구현

union-by-rank 구현을 위해서는 rank라는 공간이 필요하다.  
각 노드는 랭크값을 가지고, 랭크의 판별은 최상위 노드의 랭크로 판별하면 간단하다.

```py
from string import ascii_uppercase
parentOf = {v : v for v in ascii_uppercase[:6]}
rank = {v : 0 for v in ascii_uppercase[:6]}

def Find(node):
    if parentOf[node] != node:
        return Find(parentOf[node])
    return node

def Union (n1, n2):
    p1 = Find(n1)
    p2 = Find(n2)
    if p1 == p2:
        return
    # union-by-rank 구현
    if rank[p1] < rank[p2]:
        parentOf[p1] = p2
    elif rank[p1] > rank[p2]:
        parentOf[p2] = p1
    else:
        rank[p1] += 1
        parentOf[p2] = p1

Union('E', 'F')
Union('D', 'E')
Union('C', 'D')
Union('B', 'C')
Union('A', 'B')
print(parentOf)
```

최악의 경우로 나타났던 것이 1의 랭크를 가지는 집합이 되었다.

### Find함수에서 최적화 : path-compression

경로압축이라고 하며, Find를 실행한 노드와, 타고 올라간 노드들을 루트 노드에 바로 연결하여 다음 Find 연산시 탐색 횟수를 줄이는 방법

시간복잡도 : union-by-rank를 구현했을때, $O(log N)$의 시간복잡도를 가진다고 했는데,  
path-compression을 구현했을 때는, $O(1)$의 시간복잡도에 가깝다.

path-compression 기법을 간단하게 적용하기 위해서 Find함수를 재귀함수로 구현했다.

## path-compression 구현

path-compression은 간단하게 구현된다.  
기존에는 Find(parentOf[node])의 반환값을 바로 반환했는데,  
이 값을 parentOf[node]에 저장하면서 반환하면 된다.  

```py
from string import ascii_uppercase
parentOf = {v : v for v in ascii_uppercase[:6]}
rank = {v : 0 for v in ascii_uppercase[:6]}

def Find(node):
    if parentOf[node] != node:
        # path-compression
        parentOf[node] = Find(parentOf[node])
    return parentOf[node]

def Union (n1, n2):
    p1 = Find(n1)
    p2 = Find(n2)
    if p1 == p2:
        return
    # union-by-rank 구현
    if rank[p1] < rank[p2]:
        parentOf[p1] = p2
    elif rank[p1] > rank[p2]:
        parentOf[p2] = p1
    else:
        rank[p1] += 1
        parentOf[p2] = p1

Union('A', 'B')
Union('C', 'D')
Union('A', 'D')
Union('E', 'F')
Union('D', 'F')
print(parentOf)
print(Find('F'))
print(parentOf)
```

![path](/assets/images/fastchallenge/day24/path.PNG)

D의 부모가 C가 아닌 A다.  
Union('D', 'F')에서 Find('D')를 실행하면서 경로압축으로 A를 가리키게 되었다.  

## 마지막

Union함수는 다음시간에 구현??? 한다고 한다???  
??? : 선생님 크루스칼 알고리즘이라면서요 분명 제목엔 크루스칼이랬는데...

## 2020-11-18 수정

union함수에서 같은 집합일때, 합치지 않는 부분을 안써놨다.  
Find이후 아래 코드만 추가하면 된다.  

```py
if p1 == p2:
    return
```
