#include<iostream>
using namespace std;
//最大公约数
int measure(int a,int b)
{
    int c = b;
    while(a%b!=0)
    {
        c=a%b;
        a=b;
        b=c;
    }
    return c;
}
int main()
{
    int a,b;
    cin>>a>>b;
    cout<<measure(a,b)<<endl;
    return 0;
}