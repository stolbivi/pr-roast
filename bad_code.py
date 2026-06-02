def doStuff(x, data, temp):
    # TODO: fix this later
    result = 0
    for i in range(len(data)):
        if data[i] == x:
            result = data[i] * 2
    if result == 403:
        return True
    return result
