---
title: "자료구조/👉알고리즘 - 30"
date: 2020-11-17 21:00:00
categories: fastcampus-challenge DataStructure-Note Algorithm-Note
toc : true
usemathjax: true
---
## 오늘 들은 강의 목록

1. 기본 자료구조 - 기초
2. 기본 자료구조 - 핵심

## 음계

[문제](https://www.acmicpc.net/problem/2920)

1에서 8 순서대로(오름차순)라면 ascending,  
8에서 1 순서대로(내림차순)라면 descending,  
그렇지 않은 경우 mixed를 출력하는 문제


```py
l = list(map(int, input().split(' ')))
asc, desc = True, True
for i in range(1, 7):
    if l[i] > l[i + 1]:
        asc = False
        if desc == False:
            break
    elif l[i] < l[i + 1]:
        desc = False
        if asc == False:
            break
if asc:
    print('ascending')
elif desc:
    print('descending')
else:
    print('mixed')
```

순차탐색을 하면서,  
오름차순 구조가 깨지면, ```asc = False```  
내림차순 구조가 깨지면, ```desc = False```  
이러한 연산을 하도록 했다.  
```if desc == False, if asc == False```는 중간에 끊어지도록 구현했는데, 굳이 안해도 되는 부분이다.

반복문이 종료되면 asc, desc의 상태에 따라서 출력하도록 했다.

![결과](/assets/images/fastchallenge/day30/음계.PNG)

## 블랙잭

[블랙잭](https://www.acmicpc.net/problem/2798)

카드의 갯수 N과 한도 M, N장의 카드에 써져 있는 숫자가 주어졌을 때,  
M을 넘지 않으면서 M에 최대한 가까운 카드 3장의 합을 구하는 문제다.

```py
n, m = list(map(int, input().split(' ')))
cards = list(map(int, input().split(' ')))

v = 0
for i in range(n):
    for j in range(i + 1, n):
        for k in range(j + 1, n):
            curval = cards[i] + cards[j] + cards[k]
            if v < curval and curval <= m:
                v = curval
print(v)
```

3장을 고르고, 그 합이 m보다 작고 v보다 크면 v를 업데이트한다.

## 스택 수열

[스택 수열](https://www.acmicpc.net/problem/1874)

n이 주어질때, 1부터 n까지 스택에 push, pop를 통해 주어진 수열을 나타내는 방법을 구하는 문제다.

```py
n = int(input())
nval = 1
s = []
result = ""
for i in range(n):
    v = int(input())
    while v >= nval:
        s.append(nval)
        nval += 1
        result += '+\n'
    if s[-1] != v:
        result = "NO"
        break
    s.pop()
    result += '-\n'
print(result)
```

순서대로 넣기 위한 nval(push할때마다 증가),  
수열의 다음 수을 입력받기 위한 v,  
수열에 다음으로 들어갈 값(nval)이 다음 수(v)보다 작거나 같으면 push하도록 했다.  
nval과 v가 같을때 까지 push하고 pop하면 바로 v를 가져올 수 있다.
또, v가 nval보다 작은 경우에는 v가 이전에 스택에 남아있던 값이 되어야 하므로 s[-1]을 통해서 확인하고,  
다른 경우 NO를 출력하고 종료하도록 했다.
같은 경우에는 pop하도록 했다.

NO를 No로 출력해서 엄청틀렸는데 알고리즘이 잘못됬나??하고 한참봤다..ㅋㅋ  
(boj 너무 오랜만이라서 이런 실수도 한다.)

![수열](/assets/images/fastchallenge/day30/수열.PNG)

예전에 c++로 풀었던 문제인데, 알고리즘은 같은데 언어때문인지 시간이 엄청 차이난다.

## 프린터큐

[프린터큐](https://www.acmicpc.net/problem/1966)

1. 현재 Queue의 가장 앞에 있는 문서의 ‘중요도’를 확인한다.
2. 나머지 문서들 중 현재 문서보다 중요도가 높은 문서가 하나라도 있다면, 이 문서를 인쇄하지 않고 Queue의 가장 뒤에 재배치 한다. 그렇지 않다면 바로 인쇄를 한다.

이 두 문장을 직접 구현하는 문제다.  

처음 보고 우선순위 큐?? 라는 생각이 들 수 있는데,  
문서의 수 $N < 100$, 시간제한 2초로 그냥 큐로 위 문장 그대로 구현하면 되는 문제다.

```py
import queue
tc = int(input())

for t in range(tc):
    n, m = list(map(int, input().split(' ')))
    l = list(map(int, input().split(' ')))
    cnt = 1
    pq = queue.PriorityQueue()
    q = queue.Queue()
    for i in range(n):
        val = l[i]
        q.put((val, True if i == m else False))
        pq.put((-val, val))
    while not q.empty():
        while pq.queue[0][1] > q.queue[0][0]:
            q.put(q.get())
        if q.get()[1] == True:
            print(cnt)
            break
        pq.get()
        cnt += 1
```

우선순위 큐와 큐를 사용해서
우선순위 큐로는 현재 큐보다 더 우선순위가 높은 값이 있는지 여부를 판단(시간이 널널해서 매번 탐색해도 되지만 귀찮아서..),  
큐는 출력하는 순서를 나타내기 위해 사용했다.

![프린터큐](/assets/images/fastchallenge/day30/프린터큐.PNG)

## 키로거

[키로거](https://www.acmicpc.net/problem/5397)

이 문제도 풀어보자