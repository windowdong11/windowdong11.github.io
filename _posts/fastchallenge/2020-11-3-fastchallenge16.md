---
title: "자료구조/👉알고리즘 - 16"
date: 2020-11-3 19:00:00
categories: fastcampus-challenge DataStructure-Note Algorithm-Note
toc : true
usemathjax: true
---
## 오늘 들은 강의 목록

1. 순차탐색
2. 그래프 이해
3. 그래프 종류

## 순차탐색(Sequential Search)

앞에서부터 하나하나 짚어가며 탐색하는 방법  
(탐색할때, 알고리즘을 모르는 상태에서도 가장 먼저 떠오르는 자연스러운 방법)  

시간복잡도 : $O(n)$  
n개의 요소를 모두 짚어보기때문

## 순차탐색 구현

```py
def SequentialSearch(list, value):
    for e in list:
        if e == value:
            return True
    return False
```

![결과](/assets/images/fastchallenge/day16/순차탐색결과.PNG)

리스트에서 하나씩 짚어가며 탐색하도록 구현했다.

## 순차탐색 구현 (인덱스 반환)

```py
def SequentialSearch(list, value):
    for i in range(len(list)):
        if list[i] == value:
            return i
    return -1
```

이번에는 데이터가 존재하는 인덱스를 반환하도록 변경했다.  
인덱스를 반환해야하므로 range를 통해 0번 인덱스부터 탐색하고, 데이터가 존재하는 경우 해당 인덱스를 반환하도록 했다.  
그리고 존재하지 않는 경우 -1을 반환하도록 했다.  
인덱스는 0부터 시작하므로 0보다 작은 값인 -1으로 결정했다.

## 그래프

실제 세계의 현상이나 사물을 정점(Vertex)이나 노드(Node)와 간선(Edge)로 이루어진 구조

![그래프](/assets/images/fastchallenge/day16/그래프.PNG)

## 용어

기본용어

+ 노드(Node) : 위치를 뜻함. 정점(Vertex)이라고도 함  
위 사진에서 노드는 [집, 지하철, 버스, 회사]  
+ 간선(Edge) : 각 노드들을 잇는 선. link, branch라고도 함  
위 사진에서 간선은 선들  

대충은 알아야하는 용어

+ 인접 정점/노드(Adjacent Vertex) : 간선으로 직접 연결된 정점/노드  
위 사진에서 집의 인접노드들은 지하철과 버스  
+ 정점의 차수(Degree) : 무방향 그래프에서 어떤 정점에 인접한 정점의 수
위 사진에서 간선들이 방향성을 띄지않을때, 노드 집의 차수는 2차  
+ 진입 차수(In-Degree) : 방향 그래프에서 어떤 정점에 외부에서 오는 간선의 수  
위 사진에서 지하철의 진입 차수는 1, 집의 진입 차수는 0  
+ 진출 차수(Out-Degree) : 방향 그래프에서 외부로 나가는 간선의 수  
위 사진에서 지하철의 진출 타수는 1, 집의 진출 차수는 2  

여기까지는 알면 좋겠다 하는 용어

+ 경로 길이(Path Length) : 경로를 구성하기 위한 간선의 수  
+ 단순 경로 : 중복되는 노드가 없는 경로
+ 사이클(Cycle) : 단순 경로의 시작 정점과 종료 정점이 동일한 경우를 말함

## 경로, 단순경로

아래 사진은 A-B-C로 이루어진 그래프다.

A에서 C로 가는 경로는 A->B->C가 되고,  
A에서 C로 가는 경로 사이에 중복되는 노드가 없으므로, 단순경로가 된다.

![경로](/assets/images/fastchallenge/day16/단순경로.png)

## 마지막

오늘은 강의를 두개만 봐서 그런지 내용이 좀 적다.  
요즘 집오면 너무 피곤해서 딱 필요한 만큼만 적고있는데  
그래서인지 스스로 만족을 못하고있다.

피곤함 > 내용을 줄임 > 만족 못함 > 내용 채움 > 다음날 더 피곤함 > 내용을 줄임  
대충 이런 사이클..ㅠㅠ