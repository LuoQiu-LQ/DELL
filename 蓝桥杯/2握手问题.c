//握手问题
#include<stdio.h>

int main()
{
    int total_people = 50;
    int excluded_people = 7;
    
    // 计算所有人之间的握手次数
    int total_handshakes = total_people * (total_people - 1) / 2;
    
    // 计算那 7 个人彼此之间没有进行的握手次数
    int excluded_handshakes = excluded_people * (excluded_people - 1) / 2;
    int actual_handshakes = total_handshakes - excluded_handshakes;
    
    printf("%d\n", actual_handshakes);
    return 0;
}