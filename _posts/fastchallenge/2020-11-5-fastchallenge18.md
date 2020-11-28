---
title: "자료구조/👉알고리즘 - 18"
date: 2020-11-5 20:20:00
categories: fastcampus-challenge Algorithm-Note
toc : true
usemathjax: true
---

## 오늘 들은 강의 목록

1. bfs - 2
2. bfs - 3

## bfs 구현방법?

bfs는 대부분 FIFO특성을 가진 큐를 이용해서 많이 구현한다.  
(또는 재귀함수)  
큐는 다음 탐색지점을 저장하기 위해 사용된다.  

![BFSDFS](/assets/images/fastchallenge/day18/BFSDFS.png)

이 그림을 예로 들어보면,  
>A에서 탐색을 시작할 것이기에 큐에 A삽입하고 시작하겠다. 큐 : A  
큐에서 팝을 통해 얻은 노드 A의 인접노드들을 큐에 넣으면, 큐 : B, C  
큐에서 팝을 통해 얻은 노드 B의 인접노드들을 큐에 넣으면, 큐 : C, D  
큐에서 팝을 통해 얻은 노드 C의 인접노드들을 큐에 넣으면, 큐 : D, G, H, I  
큐에서 팝을 통해 얻은 노드 D의 인접노드들을 큐에 넣으면, 큐 : H, I, E, F  
큐에서 팝을 통해 얻은 노드 G의 인접노드들을 큐에 넣으면, 큐 : I, E, F  
큐에서 팝을 통해 얻은 노드 H의 인접노드들을 큐에 넣으면, 큐 : E, F, J  
큐에서 팝을 통해 얻은 노드 I의 인접노드들을 큐에 넣으면, 큐 : F, J  
큐에서 팝을 통해 얻은 노드 E의 인접노드들을 큐에 넣으면, 큐 : J  
큐에서 팝을 통해 얻은 노드 F의 인접노드들을 큐에 넣으면, 큐 :  
큐가 비었으므로 종료.

B에서 인접노드를 큐에 넣을때, A를 생략했고, C에서도 마찬가지였다.  
여기서 드는 생각은 "왜 인접노드지만 큐에 넣지 않았을까?"  
이에 대한 답은 이미 방문한 노드이기 때문에 다시 방문할 필요가 없고,  
한번 방문한 노드의 인접노드들은 아직 방문하지 않았더라도, 큐에 추가되어 있기 때문에  
앞으로 방문하여 해당 노드의 인접노드들을 탐색 할 것이기 때문이다.

그렇다면 bfs를 구현하기 위해서는  
그래프구조, 탐색할 노드를 저장하는 큐, 방문했는지 여부를 저장하는 공간  
이렇게 세가지가 필요하다.  

강의에서는 방문여부를 큐로 저장했지만, 그래프의 각 노드를 키로 하고 True/False를 value로 하는 딕셔너리를 통해서 방문여부를 표현하기로 했다.  

## bfs 구현 (queue)

```py
import queue
graph = {}
graph['A'] = ['B', 'C']
graph['B'] = ['A', 'D']
graph['C'] = ['A', 'G', 'H', 'I']
graph['D'] = ['B', 'E', 'F']
graph['E'] = ['D']
graph['F'] = ['D']
graph['G'] = ['C']
graph['H'] = ['C']
graph['I'] = ['C', 'J']
graph['J'] = ['I']

def BFS(graph, start):
    visited = {node : False for node in graph}
    q = queue.Queue()
    q.put(start)
    visited[start] = True
    while not q.empty():
        cur_node = q.get()
        pq = copy.copy(q)
        print(cur_node, end=" ")
        for node in graph[cur_node]:
            if not visited[node]:
                visited[node] = True
                q.put(node)
BFS(graph, 'A')
```

1. 큐에 시작노드를 추가한다
2. 큐에서 꺼내고 이를 현재노드라고 한다
3. 현재 노드의 인접노드들 중 방문하지 않은 노드를 큐에 추가한다
4. 큐가 비어있을 때까지 2~3을 반복한다.

![BFS결과](/assets/images/fastchallenge/day18/BFS결과.PNG)

결과는 잘 출력된다.

## bfs 큐 내용 출력 구현 (list)

```py
def BFS(graph, start):
    visited = {node : False for node in graph}
    q = [start]
    visited[start] = True
    while q:
        cur_node = q.pop(0)
        print(cur_node)
        for node in graph[cur_node]:
            if not visited[node]:
                visited[node] = True
                q.append(node)
        print("next : ", end="")
        for e in q:
            print(e, end=" ")
        print()
```

구조를 queue.Queue를 쓰는 바람에 깊은복사가 안되서  
큐를 복사해서 사용하면 원본 큐가 바뀌는 바람에  
원래 있던 코드에 list를 이용한 큐 구현으로 변경했다.  
따라서 큐 내용을 출력할 수 있게 되었다.

위에 bfs의 과정을 설명하면서 나타낸 큐 부분과  
아래 사진에서 next로 표시된 큐의 내용 비교하면 똑같다.

![BFS큐내용](/assets/images/fastchallenge/day18/BFS큐내용.PNG)

## 마지막

않이 크롬에 고정해놓고 매일 크롬 킬때마다 보는데  
중간에 로그인 풀린지도 모르고 강의 계속듣다가 나중에 풀린거 알고 다시듣는데 후후우ㅜㅇㅠㅠ  
덕분에 한 강의를 3번씩 본다ㅋㅋㅋㅋㅋㅋㅋ

![수강끝](/assets/images/fastchallenge/day18/수강끝.PNG)