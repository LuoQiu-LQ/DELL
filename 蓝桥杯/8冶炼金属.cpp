#include<bits/stdc++.h>
using namespace std;

// a数组存储每次冶炼投入的普通金属O的数量，b数组存储对应产出的特殊金属X的数量
int a[10010], b[10010];
int n;

bool check1(int mid)
{
    for (int i = 0; i < n; i++)
    {
        if(a[i]/mid> b[i])
        return false;
    }
}
bool check2(int mid)
{
    for(int i=0;i<n;i++)
    {
        if(a[i]/mid < b[i])
        return false;
    }
}

int main()
{
    cin>>n;
    int maxn = 0;
    for(int i=0;i<n;i++)
    {
        cin >> a[i] >> b[i];
        if(a[i] > maxn) maxn = a[i];
    }
    cout << maxn << endl;

    int l=1,r=maxn;
    while(l<r)
    {
        int mid = l+(r-1)/2;
        if(check1(mid)) r=mid;
        else            l=mid+1;
    }
    return 0;
}