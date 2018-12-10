# Zadanie 2: Macierz
# Add()
# Mul()
# Det()

print("\n-= MATRIX =-")

class Matrix:
    @staticmethod
    def Add(A, B): # Addition
        wA = len(A[0])
        hA = len(A)
        wB = len(B[0])
        hB = len(B)
        if wA != wB or hA != hB:
            return None
        #print(wA, hA)
        #print(wB, hB)
        X = [None]*hA
        for y in range(hA):
            m = [None]*wA
            for x in range(wA):
                m[x] = A[y][x] + B[y][x]
            X[y] = m
        return X
        
    @staticmethod
    def Mul(A, B): # Multiplication h x w
        wA = len(A[0])  # n
        hA = len(A)     # m
        wB = len(B[0])  # m
        hB = len(B)     # p
        if wA != hB:
            return None
        #print(wA, hA)
        #print(wB, hB)
        X = [0]*hA
        for y in range(hA):
            X[y] = [0]*wB
        for y in range(hA):
            for x in range(wB):
                for z in range(hB):
                    X[y][x] += A[y][z] * B[z][x]
        return X

    @staticmethod
    def Det(A): # Determinant
        wA = len(A[0])
        hA = len(A)
        sign = 1
        result = 0
        if wA == hA:
            if wA == 1:
                return A[0][0]
            elif wA == 2:
                return A[0][0] * A[1][1] - A[0][1] * A[1][0]
            for i in range(wA):
                result += sign * Matrix.Det(Matrix.Minor(A, i, 0)) * A[0][i]
                sign *= -1
            return result

        else:
            return None
    @staticmethod
    def Minor(A, c, r): # Minor (A w/o c col and r row)
        wA = len(A[0])
        hA = len(A)
        if wA == hA:
            if wA == 2:
                return A[1-r][1-c]
            elif wA > 2:
                X = []
                for y in range(hA):
                    m = []
                    for x in range(wA):
                        if x != c and y != r:
                            m.append(A[y][x])
                    if y != r:
                        X.append(m)
                return X

a = [[0, 2], [3, 4]]
b = [[9, 8, 7], [6, 5, 4], [1, 2, 3]]
c = [[1, 0, 3], [4, 0, 6], [7, 8, 9]]
d = [[1, 4, 4, 1], [8, 5, 7, 9], [1, 3, 6, 3], [6, 2, 1, 8]]
e = [[1, 2], [8, 1], [3, 5]]
#[1,2,3]
#[4,5,6]
#[7,8,9]

print("A =", a)
print("B =", b)
print("C =", c)
print("D =", d)
print("E =", e)
print()

print("B + C =", Matrix.Add(b, c))
print("D + E =", Matrix.Add(d, e))
print()

print("A * A =", Matrix.Mul(a, a))
print("A * D =", Matrix.Mul(a, d))
print("E * A =", Matrix.Mul(e, a))
print()

print("det A =", Matrix.Det(a))
print("det B =", Matrix.Det(b))
print("det C =", Matrix.Det(c))
print("det D =", Matrix.Det(d))
print("det E =", Matrix.Det(e))