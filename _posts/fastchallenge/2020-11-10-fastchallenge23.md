---
title: "자료구조/👉알고리즘 - 23"
date: 2020-11-10 20:00:00 +0900
categories: fastcampus-challenge DataStructure-Note Algorithm-Note
toc : true
usemathjax: true
---
## 오늘 들은 강의 목록

1. 크루스칼 알고리즘
2. 크루스칼 알고리즘과 Union Find의 차이(Union Find 기본)

## 크루스칼 알고리즘

크루스칼 알고리즘은 대표적인 최소 신장 트리 알고리즘 중 하나.

1. 모든 정점을 독립적인 집합으로 만든다.
2. 모든 간선을 비용을 기준으로 정렬하고, 비용이 작은 간선부터 선택한다.
3. 선택한 간선의 양 끝 노드가 속한 집합의 최상위 노드를 확인하여,  
서로 다른 경우, 연결한다.(서로 같은 집합에 속한 경우, 연결하면 사이클이 생긴다.)

집합을 어떻게 나누고 합치는가? 라는 질문때문에 막힐텐데,  
이를 위해서 사용하는 대표적인 알고리즘이 Union-Find다.

## Union Find 알고리즘

[기존 Union Find 포스트](https://windowdong11.github.io/algorithm/union-find/Union-Find/)

(Disjoint Set)서로소 집합 자료구조를 표현하기 위한 알고리즘  
Disjoint Set

+ 서로 중복되지 않는 부분 집합들로 나눠진 원소들에 대한 정보를 저장하고 조작하는 자료구조  
(공통 원소가 없는 집합을 다루기 위한 자료구조)
+ Union, Find연산 이렇게 둘로 나뉜다.  

> Union : 두 노드가 각각 속한 서로 다른 두 집합을 하나로 합친다.  
> Find : 노드가 속한 집합의 최상위 노드를 찾는다.  

## Union Find 기본구현

```py
from string import ascii_uppercase
parentOf = {v : v for v in ascii_uppercase[:6]}

def Find(node):
    while parentOf[node] != node:
        node = parentOf[node]
    return node

def Union (n1, n2):
    p1 = Find(n1)
    p2 = Find(n2)
    parentOf[p2] = p1 # p1과 p2가 같아도 상관없다. 원래 최상위 노드는 자기자신을 가리키기 때문.

Union('D', 'A')
Union('D', 'B')
Union('D', 'F')
Union('E', 'C')
print(parentOf) # 좌측 그래프

Union('C', 'A') # E가 속한 집합의 아무 노드, D가 속한 집합의 아무 노드
print(parentOf) # 우측 그래프
```

![기본](/assets/images/fastchallenge/day23/basic-result.PNG)

![그래프](/assets/images/fastchallenge/day23/union.png)

위 그래프를 코드로 나타내었다.  
1번째 줄이 좌측 그래프를 나타내고, 2번째 줄이 우측 그래프를 나타낸다.  

Union Find에서는 현재 노드에서 부모노드를 알아야한다.  
따라서 부모노드를 가리키는 공간을 만들었다.  
또 Union을 하기 위해서는 최상위 노드를 찾아야하는데,  
이 기능은 Find가 가지고 있어서 Find를 먼저 구현했다.

Find 구현은 자기 자신을 가리키지 않을 때까지 반복해서 부모노드를 타고 올라가는 방식이다.  
Union 구현은 Find를 통해 두 노드의 최상위 노드를 찾고,  
한 최상위 노드가 다른 최상위 노드를 가리키도록 한다.  
이 때, 두 노드가 같은 집합에 속해서 같은 최상위 노드를 가질때,  
p1 <- p2가 되도록 하는데 문제가 생기지 않는다.  
그 이유는, 초기화할 때 각 노드는 부모노드를 자기자신으로 하여 독립적인 집합을 갖도록 하는데,  
최상위 노드는 부모노드가 자기자신으로 초기화 되고, 이후 변경되지 않기 때문이다.

## Union Find 최적화

기본적으로 짜여진 Union Find를 하다보면,  
최악의 경우 아래 사진처럼 한쪽으로 치우쳐져서  
단방향 연결리스트의 형태가 만들어 질 수 있다.  
![worst](/assets/images/fastchallenge/day23/worst.png)

이러한 경우를 해결하기 위한 최적화 기법들이 있다.  

1. path-compression : 경로압축
2. union-by-rank

## 마지막

포스트의 맨 마지막에 크루스칼 알고리즘을 작성했는데,  
강의에서는 크루스칼 알고리즘을 하고, "집합을 어떻게 찾고 합치는가?"라는 부분에서  
Union-Find를 소개하고, Union-Find로 넘어가기 시작했다.  
그래서 약간 포스트도 순서가 섞였다.

다음 포스트에서 Union-Find를 마무리짓고, 크루스칼을 다시 정리하겠다.
이번 포스트는 Union-Find가 왜 필요한가? + Union-Find 기본 구현정도로만 보면 되겠다.