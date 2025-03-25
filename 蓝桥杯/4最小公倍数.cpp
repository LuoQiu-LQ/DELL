#include<iostream>
using namespace std;
//最小公倍数
int main()
{
    int a,b;
    cin>>a>>b;
    int i = 1 ;
    while (1)
    {
        if(a*i%b==0)
        {
            break;
        }
        i++;
    }
    cout << a*i << endl;
    return 0;
}