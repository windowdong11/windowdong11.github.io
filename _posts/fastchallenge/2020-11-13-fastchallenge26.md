---
title: "자료구조/👉알고리즘 - 26"
date: 2020-11-13 23:27:00
categories: fastcampus-challenge DataStructure-Note Algorithm-Note
toc : true
usemathjax: true
---
## 오늘 들은 강의 목록

1. 프림 - 2
2. 프림 - 3

## 프림 알고리즘 구현

![p1](/assets/images/fastchallenge/day26/prim1.png)

프림 알고리즘을 구현해보고, 위 그래프의 A에서 시작해서 프림 알고리즘을 테스트해보겠다.

프림알고리즘 구현 내용은 다음과 같다.

1. 시작 노드를 선택
2. 선택한 노드를 "연결된 노드 집합"에 넣음
3. 선택한 노드와 연결된 간선들을 "간선 리스트"에 넣음
4. "간선 리스트"에서 최소 가중치를 가진 간선을 선택
5. 선택한 간선의 인접 노드가 "연결된 노드 집합"에 속하지 않는다면 해당 간선과 연결된 노드를 트리에 추가,  
해당 노드를 "연결된 노드 집합"에 추가, 해당 노드의 간선들을 "간선 리스트"에 추가
6. 선택한 간선을 "간선 리스트"에서 제거
7. "간선 리스트"에 간선이 없을 때까지 4번에서 6번 반복

```py
from collections import defaultdict
from heapq import *

def prim(edges, start_node):
    tree = []
    # 각 노드별로 연결된 간선을 정리
    edgesOf = defaultdict(list)
    for weight, n1, n2 in edges:
        edgesOf[n1].append((weight, n1, n2))
        edgesOf[n2].append((weight, n2, n1))
    # 연결된 노드들
    connected_n = set(start_node)
    # 간선 리스트
    connected_e = edgesOf[start_node]
    heapify(connected_e)
    
    while connected_e:
        next_e = heappop(connected_e)
        if next_e[2] not in connected_n:
            # 트리에 경로 추가
            tree.append(next_e)
            # 연결된 노드에 추가
            connected_n.add(next_e[2])
            # 간선 리스트에 추가
            for edge in edgesOf[next_e[2]]:
                # 추가하려는 노드가 연결되지 않은 경우 추가
                if edge[2] not in connected_n:
                    heappush(connected_e, edge)

    return tree
    
    
graph = [
    (7, 'A', 'B'), (5, 'A', 'D'),
    (8, 'B', 'C'), (9, 'B', 'D'), (7, 'B', 'E'),
    (5, 'C', 'E'),
    (7, 'D', 'E'), (6, 'D', 'F'),
    (8, 'E', 'F'), (9, 'E', 'G'),
    (11, 'F', 'G')
]
prim(graph, 'A')
```

![prim](/assets/images/fastchallenge/day26/prim.PNG)

정상적으로 mst가 아래 그래프처럼 결과가 나왔다.

![p1](/assets/images/fastchallenge/day26/prim1.png)
![p2](/assets/images/fastchallenge/day26/prim2.png)
![p3](/assets/images/fastchallenge/day26/prim3.png)

## 마지막

이번 두 강의에서는 기본적인 프림 알고리즘 구현을 했다.  
다음 강의에서는 개선된 프림 알고리즘을 구현할 것이다.

![수강](/assets/images/fastchallenge/day26/수강.PNG)  
+깨알 오타, 알고르즘