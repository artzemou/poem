"""
    generate all possible anagrams of a string
"""
import pickle
import sys
import json

# d = set()


# def permutr(s):
#     #
#     # 1 trivial case - easy case found
#     #
#     if len(s) <= 1:
#         return list(s)
#     #
#     # 1 general - recursive case - method
#     # for all chars in s, pick-up one char and assemble an anagram
#     # with this char first and each permutation of the remaining chars
#     # of the original string
#     #
#     l = []
#     for ic in range(len(s)):
#         c = s[ic]  # char at ic
#         sic = s[:ic] + s[ic + 1:]  # string privated from char @ ic
#         l += list(map(lambda x: c + x, permutr(sic)))
#     return l


# def permut(n):

#     def inc(t):
#         r = 1
#         for i in range(n):
#             t[n - 1 - i] = t[n - 1 - i] + 1
#             if t[n - 1 - i] < n:
#                 r = 0
#                 break
#             else:
#                 t[n - 1 - i] = 0
#         return t, r

#     #
#     # r is for report or "retenue" in French
#     # t is a list denoting the permutation
#     # the first relevant value for t is [ 0, 1, 2 ..., n-1]
#     #
#     t = list(range(n))
#     yield tuple(t), 0
#     #
#     # r =1 means we need to keep incrementing
#     #
#     while True:
#         #
#         # the list represents a Base n int
#         # incrementation starts from the right and uses a kind of
#         # modulo : if the result exceeds n-1, it is reset to 0 and r
#         # is set to 1, meaning that incrementatio shall continue with
#         # the next digit on the left
#         #
#         t, r = inc(t)
#         #
#         # incrementation succeeded : no need to modify digits on the left
#         # check that we have a list with different values that denotes a
#         # valid permutation which will be yielded
#         #
#         if r == 0 and len(set(t)) == n:
#            yield tuple(t), r
#         if r == 1:
#             #
#             # r=1 will signal an overflow condition
#             # the value of t should be [ n-1 , n-1, ..., n-1]
#             # it cannot support further incs
#             #
#             yield tuple(t), r
#             break


# class Permut_iterator:

#     def __init__(self, n):
#         self.n = n
#         self.gen = permut(n)

#     def __iter__(self):
#         return(self)

#     def __next__(self):
#         t, r = next(self.gen)
#         if r == 1:
#             raise StopIteration
#         return t


# def fac(n):
#     if n:
#         return n * fac(n - 1)
#     else:
#         return 1


# for x in Permut_iterator(3):
#     print(x)

# print([x for x in Permut_iterator(3)])


# def permuti(s):
#     l = []
#     for x in Permut_iterator(len(s)):
#         l += ["".join(map(lambda i: s[i], x))]
#     return l


# for m in ['', 'a', 'ab', 'abc', 'abcd', 'abcde'] :
#     print (permutr(m), len(permutr(m)))

# for m in ['', 'a', 'ab', 'abc', 'abcd', 'abcde'] :
#     print (permuti(m), len(permuti(m)))


# def load_dict1(fn):
#     try:
#         with open(fn, "rt", encoding="utf-8") as f:
#             s = f.read()
#     except FileNotFoundError:
#         print("Cannot open/read file: ", fn)
#         sys.exit(1)
#     return set(s.split("\n"))


def load_dict(fn):
    try:
        with open(fn, "rt", encoding="utf-8") as f:
            s = f.read()
    except FileNotFoundError:
        print("Cannot open/read file: ", fn)
        sys.exit(1)
    d = {}
    for w in set(s.split("\n")):
        fw = formula(w)
        d[fw] = d.get(fw, set()) | {w}

    return d


def write_dict(d):
    with open ("resources/optdict.pkl", "wb") as f:
        pickle.dump(d, f, pickle.HIGHEST_PROTOCOL)


def read_dict():
    with open ("resources/optdict.pkl", "rb") as f:
        return pickle.load(f)


def formula(m):
    d = {c:m.count(c) for c in m}
    return "".join(map(lambda x: x + str(d[x]), sorted(d)))


# def buildDictionary(m):
#     # d=load_dict("resources/liste.de.mots.francais.frgut.txt")
#     d=load_dict("resources/liste_francais.txt")
#     write_dict(d)

d = read_dict()
m = "toupie"
m = sys.argv[1]

try:
    print(json.dumps(list(d.get(formula(m)))))
except:
    print(json.dumps(list()))