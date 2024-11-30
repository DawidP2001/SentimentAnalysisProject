def countLables(values):
    print(type(values))
    resultArray = [0,0,0]
    for value in values:
        print(value['label'])
        if(value['label'] == 'POSITIVE'):
            resultArray[0] = resultArray[0]+1
        if(value['label'] == 'NEUTRAL'):
            resultArray[1] = resultArray[1]+1
        if(value['label'] == 'NEGATIVE'):
            resultArray[2] = resultArray[2]+1
    return resultArray