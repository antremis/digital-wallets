l = [7, 8, 6, 3, 6]

distance = [0, 0, 0, 0, 0]
for i in range(1, len(l)) :
    distance[i] = distance[i-1] + l[i-1]

print(distance)