---
title: "👉자료구조/알고리즘 - 8"
date: 2020-10-26 22:00:00 +0900
categories: fastcampus-challenge DataStructure-Note
toc : true
usemathjax: true
---
# 학습기록
## 오늘 들은 강의 목록
32. 힙 - 2
33. 힙 - 3

오늘 포스트의 주된 내용은 힙 구현일 거에오

## 배열을 통한 힙 구현

일반적으로 배열을 사용해서 많이 구현한다.  
0번 인덱스는 버리고, 1번 인덱스부터 구현하면 편함  

![배열 힙](/assets/images/fastchallenge/day8/heap_array.png)  
위 그림에서 처럼 최상위 노드를 1,  
왼쪽부터 오른쪽으로 +1씩 인덱스를 잡으면,  
1의 자식 2, 3  
2의 자식 4, 5  
3의 자식 6, 7  
4의 자식 8, 9  
n의 자식 2n, 2n+1로 정리 할 수 있다.

어떤 노드의 배열에서 인덱스를 n이라 할때,  
부모노드의 인덱스는 $mod(n, 2)$이고,  
왼쪽 자식노드의 인덱스는 2n,  
오른쪽 자식노드의 인덱스는 2n + 1이 된다.

```py
class MaxHeap():
    def __init__(self, data):
        self.heap = [None, data]
    def push(self, data):
        cur_idx = len(self.heap)
        next = cur_idx // 2
        self.heap.append(data)
        while self.heap[next] and self.heap[next] < self.heap[cur_idx]:
            self.heap[cur_idx], self.heap[next] = self.heap[next], self.heap[cur_idx]
            cur_idx = next
            next = next // 2
    def pop(self):
        if len(self.heap) > 1:
            data = self.heap[1]
            self.heap[1] = self.heap[-1]
            del self.heap[-1]
            
            if len(self.heap) > 1:
                cur = 1
                if cur * 2 + 1 < len(self.heap): # 양쪽 다 자식노드 존재
                    next = cur * 2 if self.heap[cur * 2] > self.heap[cur * 2 + 1] else cur * 2 + 1
                elif cur * 2 < len(self.heap): # 왼쪽만 자식노드 존재
                    next = cur * 2
                else: # 자식노드 없음, 반복문 실행안함
                    next = cur
                while next < len(self.heap) and self.heap[cur] < self.heap[next]:
                    print("swap", self.heap[cur], self.heap[next])
                    self.heap[cur], self.heap[next] = self.heap[next], self.heap[cur]
                    cur = next
                    if cur * 2 + 1 < len(self.heap): # 양쪽 다 자식노드 존재
                        next = cur * 2 if self.heap[cur * 2] > self.heap[cur * 2 + 1] else cur * 2 + 1
                    elif cur * 2 < len(self.heap): # 왼쪽만 자식노드 존재
                        next = cur * 2
                    else: # 자식노드 없음, 반복문 실행안함
                        next = cur
            return data

mh = MaxHeap(100)
mh.push(1000)
mh.push(500)
mh.push(300)
mh.push(700)

data = mh.pop()
while data:
    print(data)
    print(mh.heap)
    print()
    data = mh.pop()
```

![실행결과](/assets/images/fastchallenge/day8/실행결과.PNG)

실행결과는 위와 같다.  
단순하게 힙에서 추가(push)와 삭제(pop)만 구현했다.  

## 데이터 삽입 구현

저번시간에도 적었지만,  

맨 마지막에 데이터를 넣고 시작해서,  
부모노드보다 현재노드가 더 크다면 서로 스왑하는 과정을 반복한다.

## 데이터 삭제 구현

처음에는 아무생각없이 마지막 요소을 삭제하는 코드를 작성했다.  

먼저 최상위 노드에 마지막 노드를 넣고,
마지막 노드를 삭제한다.
노드가 남아있다면, 현재 노드와 자식 노드를 비교하여 하위 노드가 더 크다면 서로 스왑하는 과정을 반복한다.

## 마지막

어쩌다 보니 마지막 자료구조 강의까지 들었다.  
다음에 트리를 다시 제대로 구현해봐야겠지만, 평일에는 시간이 안나서 주말에 해봐야겠다.  
이런 속도면 50일 안에 이 강좌 전체를 몇 사이클이나 돌릴 수 있을까?  
방금 대충 예상해보려다가 질릴뻔했다..ㅋㅋ 지금 이대로만 하자ㅠㅠ  

이건 그냥 기분좋아서 찍은 인증샷?  
중간에 MAC에 주피터설치 강의가 끼어있어서 건너뛰어서 체크가 안되있는데 약간 불-편하다.  
![인증샷](/assets/images/fastchallenge/day8/인증샷.PNG)

다음 강의부터는 알고리즘 이론!  
가장 재미있으면서 :) , 가장 화날 수도 있는 부분 :(

(오늘은 글자보다 코드가 더 많네?)