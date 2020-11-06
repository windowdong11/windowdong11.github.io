---
title: "[패스트캠퍼스 수강 후기] 알고리즘 / 기술면접👉코딩테스트인강 100% 환급챌린지 19회차 미션
"
date: 2020-11-6 23:20:00
categories: fastcampus-challenge Algorithm-Note
toc : true
usemathjax: true
---

## 오늘 들은 강의 목록

1. dfs
2. 그리디 - 1
3. 그리디 - 2

## DFS(깊이 우선 탐색)

dfs는 한쪽 방향으로 깊게 탐색하고,  
끝까지 간 후에 다시 이전노드로 돌아가서 해당 노드의 다른 자식의 끝까지 탐색하는 것을 계속해서 반복한다.

따라서, bfs와는 다르게 stack를 사용한다.

## DFS 구현

![그래프](/assets/images/fastchallenge/day19/BFSDFS.png)

위 그래프를 구현하고, dfs 순서는 조금 다르다.(오른쪽부터 시작)

```py
def DFS(graph, start):
    visited = {node : False for node in graph}
    s = [start]
    visited[start] = True
    while s:
        cur_node = s.pop()
        print(cur_node)
        for node in graph[cur_node]:
            if not visited[node]:
                visited[node] = True
                s.append(node)
        print("next : ", end="")
        for e in s:
            print(e, end=" ")
        print()
DFS(graph, 'A')
```

위 코드는 BFS코드에서 큐만 스택으로 바꾼 코드다.

![dfs](/assets/images/fastchallenge/day19/dfs.PNG)

위 그림에서 next는 스택을 의미한다.

>A에서 탐색을 시작할 것이기에 스택에 A삽입하고 시작하겠다. 스택 : A  
스택에서 팝을 통해 얻은 노드 A의 인접노드들을 스택에 넣으면, 스택 : B, C  
스택에서 팝을 통해 얻은 노드 C의 인접노드들을 스택에 넣으면, 스택 : B, G, H, I  
스택에서 팝을 통해 얻은 노드 I의 인접노드들을 스택에 넣으면, 스택 : B, G, H, J  
스택에서 팝을 통해 얻은 노드 J의 인접노드들을 스택에 넣으면, 스택 : B, G, H  
스택에서 팝을 통해 얻은 노드 H의 인접노드들을 스택에 넣으면, 스택 : B, G  
스택에서 팝을 통해 얻은 노드 G의 인접노드들을 스택에 넣으면, 스택 : B  
스택에서 팝을 통해 얻은 노드 B의 인접노드들을 스택에 넣으면, 스택 : D  
스택에서 팝을 통해 얻은 노드 D의 인접노드들을 스택에 넣으면, 스택 : E, F  
스택에서 팝을 통해 얻은 노드 F의 인접노드들을 스택에 넣으면, 스택 : E  
스택에서 팝을 통해 얻은 노드 E의 인접노드들을 스택에 넣으면, 스택 :  
스택이 비었으므로 종료.

## 그리디(Greedy algorithm, 탐욕 알고리즘)

최적의 해에 가까운 값을 구하기 위함  
매순간 해를 선택해야 할때마다, 최적의 해를 고르는 방식이다.  

> 매 순간 주어지는 선택지들 중 가장 좋은 선택지를 고른다.

## 동전문제

> 지불해야하는 값이 7230원 일 때, 1원 50원 100원 500원 동전으로 동전의 수가 가장 적도록 지불하는 방법

1. 동전의 수가 가장 적게 하기 위해서는 "매 순간 지불할 수 있는 동전들 중 가장 큰 값을 가진 동전으로 지불"하면 된다.

```py
def coin(cost, values):
    values.sort()
    values.reverse()
    cnt = 0
    for value in values:
        cnt += cost // value
        cost = cost % value
    return cnt
coin(4720, [500, 100, 50, 1])
```

1. 사용 가능한 동전들 중 가장 큰 값부터 선택
2. 선택한 동전으로 최대한 지불

![coin](/assets/images/fastchallenge/day19/coin.PNG)

## 마지막

![수강](/assets/images/fastchallenge/day19/수강.PNG)

## 내가 듣는 인강

**알고리즘 / 기술면접👉https://bit.ly/2FgOONG**