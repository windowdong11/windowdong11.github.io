---
title: "👉자료구조/알고리즘 - 2"
date: 2020-10-20 17:05:00 +0900
categories: fastcampus-challenge DataStructure-Note
toc : true
---
## 오늘 들은 강의 목록

6. 배열
7. 파이썬과 배열
8. 큐(Queue) - 1
9. 큐(Queue) - 2

# 배열 (Array)

## 배열?

데이터를 나열하고 각 데이터를 인덱스에 대응하도록 구성하는 데이터 구조  
파이썬에서는 리스트 타입이 배열 기능을 제공  

## 배열이 필요한 이유?

같은 종류의 데이터를 효율적으로 관리하기 위해 사용
같은 종류의 데이터를 순차적으로 저장

## 배열의 장점

1. 인덱스를 통한 빠른 접근

## 배열의 단점

1. 배열 선언시 최대 길이를 지정해야한다. 따라서 데이터의 추가가 어렵다  
2. 중간에 있는 데이터 삭제시  
(데이터가 이어져있어야 하는 경우) 시간적 낭비가 발생한다.  
뒤에 끊긴 데이터를 앞으로 끌어와야하기 때문  
(데이터가 끊어져도 상관 없는 경우) 공간적 낭비가 발생한다.  
중간에 사용하지 않는 빈 공간이 생기기 때문  

> 여기서 말하는 배열의 단점은 파이썬에서는 거의 존재하지 않는다.  
> 파이썬은 리스트 등을 배열처럼 사용하는데 리스트는 최대길이를 지정할 필요가 없다.  
> 최대길이가 넘어가더라도 추가할 수 있고, 중간에 값만 지우는 것이 아닌 공간을 삭제할 수도 있다.  
> 따라서 c언어에서의 배열을 한번 확인하는 것이 좋겠다.

## C에서의 배열

```c
/*
    배열의 크기를 글자수 + 1로 지정한 이유는 마지막에 문자열의 끝을 의미하는 널 문자가 포함되기 때문
    ex)he\0, she\0
*/
char str1[3] = "he";
char str2[4] = "she";
printf("%s\n", str1);
printf("%s\n", str2);
```

이처럼 c에서는 배열의 크기를 지정해줘야하고, 배열의 크기보다 큰 값을 넣을 수 없다.  
(c가 워낙 포용적이라 넣을수는 있지만 제대로 작동은 안한다.)  

## 리스트를 활용한 1차원 배열

![1차원배열](/assets/images/fastchallenge/day2/1차원배열.PNG)
리스트를 이용한 간단한 1차원 배열이다.  

```py
d1_array = [1, 2, 3, 4, 5]
d1_array
```

마지막에 변수명을 사용하면, 배열(리스트)의 값들이 출력된다.

## 리스트를 활용한 2차원 배열

![2차원배열](/assets/images/fastchallenge/day2/2차원배열.PNG)
리스트를 이용한 간단한 1차원 배열이다.  
```py
d2_array = [[1, 2, 3], [4, 5, 6]]
d2_array
```

## 1차원 배열을 활용한 주문리스트

1차원 배열로 주문리스트를 구현하고 2번째에 어떤 주문이 들어왔는지 확인해보자

![주문리스트](/assets/images/fastchallenge/day2/orderlist.PNG)

```py
orderlist = ['페퍼로니피자', '고구마피자', '감자피자']
orderlist
```

주문리스트를 이렇게 구현하고, 2번째로 주문된 피자가 어떤피자인지 알아보자  

![2번째 주문](/assets/images/fastchallenge/day2/orderlist_order1.PNG)
```py
orderlist = ['페퍼로니피자', '고구마피자', '감자피자']
print(orderlist[1])
```
```orderlist[2]```가 아닌 이유는, 배열의 인덱스는 0부터 시작한다.  
따라서, n번째로 주문된 피자는 ```orderlist[n-1]```에 저장되어있다.

## 2차원 배열을 활용한 유저DB

2차원 배열로 [국적, 이름]을 저장하고 이름으로 유저의 국적을 찾는 함수를 구현해보자
![유저DB](/assets/images/fastchallenge/day2/UserDB.PNG)

```py
user_db = [['Actor', '강동원'], ['Singer', 'Dan Reynolds']]

def searchWithName(name):
    for elem in user_data:
        if elem[1] == search:
            return elem[0]

name = 'Dan Reynolds'
print(searchWithName(name))
```

```user_data```에서 하나의 요소를 꺼내어 이름이 일치하다면 국적을 반환하는 함수를 만들었다.
일치하는 것이 하나도 없다면, 알아서 None를 반환할 것이다

## 연습문제

문자열들이 들어가있는 1차원 배열에서 M이 들어간 갯수를 구해라
![Mcount](/assets/images/fastchallenge/day2/Mcount.PNG)

```py
dataset = ["Mr hello man", "bye Mr hello"]
m = 0
for data in dataset:
    for ch in data:
        if ch == 'M':
            m += 1
print(m)
```

# 큐 (Queue)

## 큐?
먼저 넣은 데이터가 먼저 나온다.  
주로 First In First Out(FIFO)구조를 따름. (Last In Last Out이라고도 한다. 이 강의에서 처음들어봄. 잘 안쓰는 말)  
현실에서의 대표적인 예로 줄서기가 있다.  

## 용어
+ Enqueue : 데이터를 넣음
+ Dequeue : 데이터를 꺼냄

## 파이썬의 queue라이브러리
```queue.Queue()``` : 가장 기본적인 큐, FIFO를 따름  
```quque.LifoQueue()``` : LIFO를따름(Last In First Out)  
스택과 같은데 왜 쓸까? (시간적으로나 공간적으로나 낭비가 아닐까?)  
```queue.PriorityQueue()``` : 우선순위 큐, 곧 아주 중요하게 사용될 큐
### enqueue
```py
# 우선순위 큐를 제외한 다른 큐들은 값만 넣어주면 된다.
queue.put(value)
# 우선순위 큐의 경우 이렇게 튜플로 우선순위까지 줘야한다.
PriorityQueue.put((priority, value))
#예시
q = queue.Queue()
q.put(1)
q = queue.PriorityQueue()
q.put((1, "Vip"))
```
### dequeue
```py
queue.get()
# 예시
q = queue.Queue()
q.put(1)
q.get()
```
### queue size
```py
queue.qsize()
# 예시
q = queue.Queue()
q.size()
```

## 큐가 많이 쓰이는 곳

+ 멀티 테스킹을 위한 프로세스 스케줄링  
각 코어가 어떤 일이든 해결하는데 같은 시간이 걸린다고 가정하여 아주 간단하게 코드로 작성해보면 아래와 같다
![스케줄링](/assets/images/fastchallenge/day2/process_schedule.PNG)  
스케줄링할때 급한 작업이 추가될 수도 있으므로 우선순위 큐를 사용할수도 있겠다.

## 큐를 리스트를 이용해 구현해보자
![큐구현](/assets/images/fastchallenge/day2/queue_by_list.PNG)
```py
queue = []
def enqueue(data):
    queue.append(data)
def dequeue():
    return queue.pop(0) # 0번째 자리의 요소를 제거
```
이렇게 리스트를 이용해서 큐를 구현해보았다.  
만약 dequeue할때 요소가 없으면 index에러를 나타내게 되는데,  
이는 ```if len(queue):```를 통해서 길이가 0보다 클때만 실행하도록 하면 된다.
그러나 이렇게 하지 않은 이유는 이런 확인이 필요하지 않는 경우 불필요한 연산을 증가시키기 때문이다.  
필요하다면 추가하는게 어렵지 않아서 놔뒀다.  

# 강의 후기

강사님이 c를 이용해 배열을 보여주셨듯이, 배열만큼은 c처럼 길이를 지정해야 하는 언어로 하면 더 와닿을텐데 파이썬이라는게 조금 아쉽다.  
수강하시는 분들께서 딱 c언어 배열 기초까지만이라도 알면 좋겠다.
그래도 c를 꺼내주셔서 파이썬만할대보다는 좀 와닿지 않았을까? 라는 생각도 들었다.

## 완주반에 대해서

방금 막 문자가 왔는데, 어제 미션성공했다고 문자가 왔다.  
내가 알아봤던 패캠은 이런 곳이 아니라 아무런 안내도 안되서 미션을 성공했는지 실패했는지 여부도 알기 힘든곳이라고 생각했는데..?  
그 후에 피드백을 받고 변한건지 생각보다 괜찮다?  

## 내가 잠깐 다녔던 학원 OO은행

예전에 정말 광고에 혹해서 연락한번해봤다가 괜찮겠다 해서 등록했던 어느 은행이 있다.  
여기가 정말 괜찮은가 하고 1시간거리를 잠깐 다녀봤었는데..  
정말정말 강사가 별로여서 거의 안다녔다.  
서버 뭐시기는 강사님은 꽤 괜찮았는데 이미 다른강좌로 학원 이미지를 버려놔서ㅋㅋ 꼴도보기싫어서 안들었다.(대충 돈버렸다는 뜻)  
(여기에 안 적고 나중에 최종 수강후기같은걸로 적으려고 했는데 나중되면 까먹을까봐서 여기 남김, 이런거 적어도 상관없겠지? 내 블로그인데 뭐라할까오..?)  

## 마지막

누군가에게 도움이 되는 글이 되었으면 좋겠다.  