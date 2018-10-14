#include <stdio.h>

int main()
{
    printf("Hello World!!\n");

    int x=23,y=23;
    if(x<y)
    {
        printf("你猜的比我想的数字小\n");
    }
    else if(x>y)
    {
        printf("你猜的比我想的数字大\n");
    }
    else
    {
        printf("猜对了！\n");
    }
    return 0;
}
