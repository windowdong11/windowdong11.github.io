---
title: "자료구조/👉알고리즘 - 31"
date: 2020-11-18 00:00:00
categories: fastcampus-challenge Problem-Solving
toc : true
usemathjax: true
---
## 오늘 들은 강의 목록

1. 고급 자료구조 - 2
2. 기본 정렬 기초

## 고급 자료구조 - 2

### SHA-256

[SHA-256](https://www.acmicpc.net/problem/10930)

```py
import hashlib
print(hashlib.sha256(input().encode()).hexdigest())
```

### 수 찾기

[수 찾기](https://www.acmicpc.net/problem/1920)

n길이의 수열이 주어지고 이를 A라 하고, m개의 수가 주어질때
m개의 수가 A안에 존재하는지 여부를 확인하는 문제

```py
result = []
n = int(input())
a = list(map(int, input().split(' ')))
m = int(input())
x = list(map(int, input().split(' ')))
a.sort()
for e in x:
    start, end = 0, n
    inserted = False
    while start < end:
        mid = (start + end) // 2
        if a[mid] == e:
            result.append('1')
            inserted = True
            break
        elif a[mid] < e:
            start = mid + 1
        else:
            end = mid
    if not inserted:
        result.append('0')
print('\n'.join(result))
```

첫 수열을 정렬해서 이진탐색을 통해 결과를 구했다.  
시간복잡도는 정렬하는데 $n log n$이라 하면,  
n개를 정렬하는 시간 + m개를 n개에서 이진탐색으로 찾는시간  
$n log n + m log n$이다.

![수찾기1](/assets/images/fastchallenge/day31/수찾기1.PNG)


다음 풀이는 파이썬 기본 자료구조 set(집합)을 사용해봤다.

```py
result = []
n = int(input())
a = set(map(int, input().split(' ')))
m = int(input())
x = list(map(int, input().split(' ')))
for e in x:
    print(1 if e in a else 0)
```

![수찾기2](/assets/images/fastchallenge/day31/수찾기2.PNG)

ㅗㅜㅑㅗㅜㅑ.. 엄청 빠른것

### 친구 네트워크

[친구 네트워크](https://www.acmicpc.net/problem/4195)

친구 관계가 주어질때마다 관계를 구성하고,  
해당 그룹의 친구 수를 구하는 문제다.

```py
parentOf = {}
rank = {}
friend = {}

def Find(node):
    if parentOf[node] != node:
        parentOf[node] = Find(parentOf[node])
    return parentOf[node]

def Union (n1, n2):
    p1 = Find(n1)
    p2 = Find(n2)
    if p1 == p2:
        return #friend[p1]
    if rank[p1] < rank[p2]:
        parentOf[p1] = p2
        friend[p2] += friend[p1]
        #return friend[p2]
    elif rank[p1] > rank[p2]:
        parentOf[p2] = p1
        friend[p1] += friend[p2]
        #friend[p1]
    else:
        rank[p1] += 1
        parentOf[p2] = p1
        friend[p1] += friend[p2]
        # return friend[p1]

tc = int(input())
for _ in range(tc):
    parentOf = {}
    rank = {}
    friend = {}
    f = int(input())
    for _ in range(f):
        fs = input().split(' ')
        for i in fs:
            if i not in friend:
                friend[i] = 1
                rank[i] = 0
                parentOf[i] = i
        Union(fs[0], fs[1])
        print(friend[Find(fs[0])])
```

완전 Union-Find 문제다.

Union함수에서 친구 수를 바로 리턴하는게 500ms 더 느리다.  
(더 빠를 줄 알았는데 ???)  
![친구 네트워크](/assets/images/fastchallenge/day31/친구네트워크.PNG)

## 기본 정렬 알고리즘

### 수 정렬하기

[수 정렬하기](https://www.acmicpc.net/problem/2750)

```py
n = int(input())
num = []
for i in range(n):
    num.append(int(input()))
num.sort()
for e in num:
    print(e)
```

입력받고 sort()로 정렬했다.  
정렬 알고리즘을 다시 구현해봐도 좋다.

### 소트인사이드

[소트인사이드](https://www.acmicpc.net/problem/1427)

```py
val = int(input())
l = []
while val:
    l.append(val % 10)
    val //= 10
l.sort()
p = 1
val = 0
for e in l:
    val += e * p
    p *= 10
print(val)
```

각 자리수를 나눠서 리스트에 저장 후, 정렬,  
정렬된 리스트를 통해 정렬한 수를 만들었다.  
$정렬한 수 = \sum_{e \in l} e * 10^{index}$

![소트인사이드](/assets/images/fastchallenge/day31/소트인사이드.PNG)

## 마지막

포스트는 써놓고 제출 안하는 바람에 미션 실패  
그래도 인강 다 들을 때까지는 쓰자