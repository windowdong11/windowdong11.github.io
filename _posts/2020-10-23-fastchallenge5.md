---
title: "👉자료구조/알고리즘 - 5(패캠강의)"
date: 2020-10-23 22:20:00 +0400
categories: fastcampus-challenge DataStructure-Note
toc : true
usemathjax: true
---
# 학습기록

## 오늘 들은 강의 목록
16. 해쉬 테이블 - 1
17. 해쉬 테이블 - 2
18. 해쉬 테이블 - 3
19. 해쉬 테이블 - 4
20. 해쉬 테이블 - 5

## 해쉬 + 테이블(Hash + Table)

해쉬 테이블은 해쉬 + 테이블이다.  
해쉬를 통해 해쉬값을 구하고, 해쉬값를 통해 테이블에 저장하거나 데이터를 찾는다.  

제대로 이해하기 위해서는 해쉬와 테이블이 무슨말인지 알아야겠다.

## 해쉬?

> 어떤 데이터을 고정된 길이로 변환하는 것

### 용어

+ 해쉬 함수(hash function) : 키(key)를 넣으면 고정된 길이의 해쉬 값이 나오는 함수 (해싱(hashing)을 하는 함수)
+ 해쉬 값(hash value), 해쉬 주소(hash address) : 키(key)를 해쉬 함수에 넣었을 때 나오는 값, 이를 통해 데이터가 저장된 슬롯에 접근할 수 있다.
+ 해쉬 테이블(hash table) : 해쉬 주소(해쉬 값)과 슬롯으로 구성된 자료구조
+ 슬롯(slot) : 해쉬주소(해쉬 값)에 대응되는 데이터가 저장되는 공간
+ 키(key) : 데이터를 통해 생성하는 키, 해쉬함수에 넣어서 해쉬 값을 구하기 위해 사용된다. (데이터를 그대로 사용하기도 한다.)

## 해쉬테이블

> 데이터를 통해 키를 구하고, 키를 해쉬함수에 넣어서 해쉬값을 가져오고, 이를 해쉬테이블에서 직접 저장하거나 데이터를 읽어온다.  
데이터 -> 키 -> 해쉬 값  

## 데이터 저장과정

1. 데이터를 키 생성함수에 넣어 키를 생성한다. **keyGen(Data) -> Key**
2. 키를 해쉬함수에 넣어 해쉬 값을 구한다. **hashFunction(Key) -> HashValue**
3. 해쉬 값을 통해 해쉬테이블의 슬롯에 저장한다. **hashTable[HashValue] = Data**

## 데이터 읽어오기

1. 데이터를 키 생성함수에 넣어 키를 생성한다. **keyGen(Data) -> Key**
2. 키를 해쉬함수에 넣어 해쉬 값을 구한다. **hashFunction(Key) -> HashValue**
3. 해쉬테이블의 해쉬 값에 해당하는 슬롯의 데이터를 읽어온다. **hashTable[HashValue]**


## 가장 기본적인 해쉬테이블 구현

```py
hashTable = [0 for i in range(1,10)]
def getKey(data):
    return ord(data[0]) # data[0]의 아스키코드값
def getHash(key):
    return key % 10
def addData(data):
    hashTable[getHash(getKey(data[0]))] = data
def readData(data):
    return hashTable[getHash(getKey(data[0]))]
addData(["Admin", "010-2020-2020"])
addData(["Baby", "010-1010-1010"])
readData("Admin")
```

문제점 : 같은 해쉬, 키를 가지는 값들이 존재할 수 있다.  

문제 발생 예시

```py
addData(["Admin", "010-2020-2020"])
addData(["Kson", "010-1010-1010"])
readData("Admin")
```

![충돌예시](/assets/images/fastchallenge/day5/충돌예.PNG)  
분명 Admin과 Kson을 추가하고, Admin을 찾았는데 Kson값이 불러와졌다?  
이는 A의 아스키코드값을 10으로 나눈 나머지인 5, K의 아스키코드값을 10으로 나눈 나머지인 5로 같은 해시 값을 가지게되었다.  
따라서 해시 값이 5인 슬롯에 Admin데이터가 쓰이고, 기존 데이터를 지우고 같은 슬롯에 Kson값이 덮어씌워졌다.  
또한 데이터를 읽을때는 해시 값이 5인 슬롯에 있는 데이터인 Kson이 읽히게 된 것이다.  

## 충돌(Collision)?

> 서로 다른 데이터가 같은 해시값을 가지는 경우를 충돌이라 한다.  

바로 위와 같은 경우가 충돌의 대표적인 예이다.  
충돌을 해결하기 위해서는 대표적으로 Chaining 기법과, Linear Probling 기법이 존재한다.

## 충돌 해결 기법들

크게 Open/Close 해싱 기법으로 나뉜다.  
또는 해쉬 테이블의 공간을 확대하고 해쉬함수를 변경한다.(충돌이 적은경우는 제외)  
같은 해시값으로 인해 충돌이 발생하기에 원하는 값을 찾기 위한 key를 같이 저장한다.  
(그렇다면 key는 독립적인 값이 되어야겠다. 가장 확실한 방법으로는 데이터를 그대로 쓰는방법)

### Chaining (Open hasing 기법 중 하나)

> 새로운 공간을 추가해서 해결하는 방법  
> 충돌이 일어나면 해당 슬롯에 연결리스트 구조로 뒤에 데이터를 추가하는 방법
> 탐색할때는 해쉬값에 대응되는 슬롯에서 탐색한다.

중복 해시값을 갖는 데이터가 추가될때마다 슬롯이 추가된다.  

아래는 1번 슬롯에서 중복이 일어난 경우  
Anthor를 추가하려는데 Andy와 Anthor가 중복이 일어나서 Anthor를 Andy뒤에 추가했다.  
![Chaining](/assets/images/fastchallenge/day5/Chaining예시.PNG)

### Linear Probling (Close Hashing 기법 중 하나)

> 해시테이블 내의 빈 공간을 활용하는 방법  
> 충돌이 일어나면 해당 슬롯부터 다음 슬롯들 중 빈 슬롯을 찾아 해당 슬롯에 삽입한다.
> 탐색할때는 해쉬값에 대응되는 슬롯부터 다음 슬롯중에서 탐색한다.

슬롯들이 해시테이블에 삽입할 데이터의 양만큼 미리 준비되어 있어야 한다.

아래는 1번 슬롯에서 중복이 일어난 경우  
Anthor를 추가하려는데 Andy와 Anthor가 중복이 일어났다.  
다음 슬롯인 2번슬롯부터 비어있는 슬롯을 찾게되는데, 마침 2번 슬롯이 비어있어서 2번에 Anthor를 추가했다.  
![Linear Probing](/assets/images/fastchallenge/day5/LinearProbing예시.PNG)

## 빈번한 충돌이 생기는 경우

여러 데이터들이 충돌이 자꾸 생기면 해시테이블을 2배 확장한다고 한다.
다만 충돌이 골고루 슬롯들에 분포되지 않은 경우는 해시함수를 변경하는 것이 좋겠다.
![함수변경](/assets/images/fastchallenge/day5/해시함수변경.PNG)

아래처럼 충돌이 어느정도 골고루 되있다면, 해시테이블을 확장하는 것이 좋겠다.
![해시테이블 확장](/assets/images/fastchallenge/day5/해시테이블확장.PNG)

아무래도 충돌이 생기지 않는게 최고긴하다.

## 파이썬에서 해시함수 : hash()

hash() : 이 함수는 실행할 때마다 값이 달라질 수 있다.
hashlib : 해시 라이브러리, sha1, sha256등을 포함하고있는데 아래에서 설명하겠다.

## 유명한 해시함수 : sha

SHA(Secure Hash Algorithm) : 대충 안전하다는 뜻이다.  
sha-1은 이미 충돌이 발생했고,  
sha-2는 아직 취약점이 없는 것 같다. 많은 기업들이 사용하고 있으며, 비트코인 또한 SHA-256을 사용한다.

### sha1/sha256 예시

```py
import hashlib
data = 'test'.encode()
hash_object = hashlib.sha1() # 여기서 sha1 -> sha256만 해주면 sha256으로 바뀐다.
hash_object.update(data)
hex_dig = hash_object.hexdigest()
```

## 시간복잡도

일반적인 경우(Collision이 없음) : O(1)  
Data -> Key -> HashValue로 상수시간으로 접근  
최악의 경우(Collision이 있음) : O(n)  
Data -> Key -> HashValue -> 탐색으로 n시간 내로 접근

## 현실에서 해시

대표적으로 블록체인에 들어간다고 한다.  
블록체인은 잘 모르겠고..  
해시를 통해서 파일 등을 위변조 검증할때 사용한다.  
일부 사이트에는 해시값을 공개해서 다운받은 파일의 해시값과 비교를 통해 위변조 된 파일인지 확인할 수 있도록 되어있다.  
또 로그인/회원가입시 비밀번호를 해싱하여 서버에 저장하게 되고, 로그인시 해시값을 비교해서 로그인 절차를 밟게 된다.

## 마지막

해시가 어떤방식으로 작동하는지 이해하는게 중요하다.  
5개의 강의로 구성되어 있는데, 드라마처럼 극적으로 끊는 느낌이 아니라 딱 맞게 파트별로 잘 끊어주셔서 너무 잘 들었다.  