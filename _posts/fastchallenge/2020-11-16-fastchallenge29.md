---
title: "자료구조/👉알고리즘 - 29"
date: 2020-11-16 19:00:00
categories: fastcampus-challenge DataStructure-Note Algorithm-Note
toc : true
usemathjax: true
---
## 오늘 들은 강의 목록

1. 백트래킹 - N queen(1)
2. 백트래킹 - N queen(2)
3. 백트래킹 - N queen(3)
4. 자료구조, 알고리즘 정리

## N queen

대표적인 백트래킹 문제중 하나다.  
한정된 체스판에 N개의 퀸을 최대로 배치하는 문제

1. 이전 퀸들이 이동할 수 없는 공간에 퀸을 배치한다
2. 배치하던 도중에 퀸을 더 이상 놓을 수 없다면,  
더 이상 다음 행으로 넘어가지 않고,  
이전 행의 퀸의 위치를 이동시킨다.

## N queen 구현

```py
def dfs(N, curRow, curList, result):
    if N == curRow:
        result.append(curList[:])
        return
    for curCol in range(N):
        check = True
        for row in range(curRow):
            if curList[row] == curCol or curRow-row == abs(curList[row] - curCol):
                check = False
        if check:
            curList.append(curCol)
            dfs(N, curRow + 1, curList, result)
            curList.pop()

result = []
dfs(4, 0, [], result)
print(result)
```

![결과](/assets/images/fastchallenge/day29/nqueen.PNG)

한줄씩 내려가면서 각 행에 퀸을 놓고,  
다음 행에 퀸을 놓을 수 있는 자리에 퀸을 놓고,  
다음 행의 특정 열에 퀸을 놓을 수 있는지 여부를 판단해 건너뛰도록 구현했다.

## 가지치기

가지치기는 특정 열에 퀸을 놓을 수 없는 경우 진행되었다.  
특정 열에 퀸을 놓을 수 없는 경우 자식으로 구성된 상태 공간 트리에서 해를 구할 수 없기 때문이다.

![backtracking](/assets/images/fastchallenge/day29/backtracking.png)

이 그림에서 (1,0), (1,1), (1,2)는 퀸을 놓을 수 없기 때문에,  
이 위치에 퀸을 놓는 상태 공간 트리에는 해가 존재하지 않아 가지치기를 통해 건너뛰었다.

이 처럼 가지치기를 하기 위해서는 퀸을 놓았을때, 경로가 겹치는지 여부를 판단해야한다.  
이를 판단하기 위해서는 수직과, 대각선이 겹치는지만 확인하면 된다.  
(수평은 매번 한 행씩 내려가서 겹치지 않음)  

수직은 ```curList[row] == curCol```  
대각선은 ```curRow-row == abs(curList[row] - curCol)```  
이렇게 판단할 수 있다.

![조건](/assets/images/fastchallenge/day29/조건.png)

## 자료구조 정리

배열, 큐, 스택, 연결리스트, 해쉬테이블, 트리, BST, 힙

## 알고리즘 정리

버블, 선택, 삽입, 병합, 퀵 (정렬)  
재귀 호출, 동적 계획법(DP), 분할 정복, 탐욕 알고리즘, 백트래킹  
순차 탐색, 이진탐색  
bfs, dfs, 다익스트라 알고리즘, 크루스칼, 프림 알고리즘 (그래프)

## 마지막

여기까지가 자료구조/알고리즘 파트였고,  
다음부터는 유형별 문제풀이 파트다.  