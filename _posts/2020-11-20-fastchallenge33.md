---
title: "자료구조/👉알고리즘 - "
date: 2020-11-1 00:00:00
categories: fastcampus-challenge DataStructure-Note Algorithm-Note
toc : true
usemathjax: true
---
## 오늘 들은 강의 목록

1. 고급 정렬

## 수 정렬하기 2

[수 정렬하기 2](https://www.acmicpc.net/problem/2751)

데이터 수 1,000,000 / 시간제한 2초 / 메모리 제한 256MB / 데이터의 범위 -1,000,000~1,000,000 (2,000,001)

$O(n^2)$은 가능할까? 1,000,000,000,000? 딱 봐도 2초 불가능해 보인다.  
그렇다면 가장 먼저 생각나는 것은 가장 최근에 해본 계수정렬이겠다.  

계수정렬은 시간복잡도 $O(n) = 1,000,000$, 메모리 사용량은 약 4MB정도,
리스트의 인덱스를 이용하려면,  
저장시 : 값 + 1,000,000 , 출력시 : 값 - 1,000,000 해야한다는 단점이 존재
메모리가 너무많이 남지 않나? 보통 메모리는 128MB주기 마련인데, 이번에는 두배로 준 이유가 있지 않을까?  

그렇다면 메모리를 두배로 쓰는 정렬 알고리즘을 생각해보면,  
병합정렬(Merge Sort)가 가장 먼저 떠오른다.  
시간복잡도는 $O(n log n)$이 보장되고,  
공간복잡도는 매번 복사할 공간이 필요해서 두배가 필요하다.

문제의 의도는 병합정렬을 구현하는 것으로 보인다.  

그러나 이전에 사용했던 계수정렬 코드를 조금만 바꾸면 되기 때문에 재사용하겠다.

```py
import sys
n = int(sys.stdin.readline())
s = [0 for _ in range(2000001)]
for _ in range(n):
    s[int(sys.stdin.readline()) + 1000000] += 1
for e in range(2000001):
    if s[e]:
        print('{}\n'.format(e - 1000000) * s[e], end='')
```

![계수](/assets/images/fastchallenge/day33/계수.PNG)

## K번째 수

[k번째 수](https://www.acmicpc.net/problem/11004)

정렬했을 때 k번째에 있는 수를 구하는 문제

시간제한 2초 / 메모리 제한 512MB / 데이터 수 5,000,000 / 값 범위 $-10^9 \le v \le 10^9$  

이번에도 메모리가 엄청 많이 주어졌다.  
정렬해야할 데이터의 양도 엄청 많다.  

가장 먼저 병합정렬을 생각해보자
$O(n log n)$ = 111,267,483 (약 1억)
될 것 같다.

다음은 계수정렬을 생각해보자
값 범위가 너무 크다. $4byte*2*10^9+1$만큼의 메모리가 필요하다.

```py
def mergeSort(list):
    if len(list) <= 1:
        return list
    mid = int(len(list)/2)
    ll, rl = list[:mid], list[mid:]
    mergeSort(ll), mergeSort(rl)
    idx, li, ri = 0, 0, 0
    while True:
        if ll[li] < rl[ri]:
            list[idx] = ll[li]
            li += 1
            idx += 1
            if li == len(ll):
                for i in range(ri, len(rl)):
                    list[idx] = rl[i]
                    idx += 1
                break
        else:
            list[idx] = rl[ri]
            ri += 1
            idx += 1
            if ri == len(rl):
                for i in range(li, len(ll)):
                    list[idx] = ll[i]
                    idx += 1
                break
    return list

n, k = list(map(int, input().split(' ')))
l = list(map(int,input().split(' ')))
print(mergeSort(l)[k - 1])
```

병합정렬을 통해서 해결했다.  
PyPy3으로 제출하지 않으면 시간초과난다.

![병합](/assets/images/fastchallenge/day33/병합.PNG)

그리고 python에서 지원하는 sort()를 통해 해본 방법

```py
n, k = list(map(int, input().split(' ')))
l = list(map(int,input().split(' ')))
l.sort()
print(l[k-1])
```

PyPy3와 Python3의 실행시간이 거의 두배정도 차이가 난다.  
또, 직접 구현한 병합정렬보다 1300ms정도 빠르다.  
-> 정렬은 직접 구현하는 것보다 내장되어 있는 것을 사용하는게 더 빠르다.

![sort기본](/assets/images/fastchallenge/day33/sort기본.PNG)