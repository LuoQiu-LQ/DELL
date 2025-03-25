#include<bits/stdc++.h>
using namespace std;

int t,n; // t为测试数据组数，n为每组数据中的飞机数量
int st[11]; // 标记数组，用于记录每架飞机的降落状态，0表示未降落，1表示已降落

struct node // 定义结构体用于存储每架飞机的信息
{
    int dao,pan,luo; // dao表示到达时间，pan表示可以盘旋的单位时间，luo表示降落所需的时间
}p[11]; // 声明结构体数组p，用于存储每组数据中所有飞机的信息

// 回溯法尝试为每架飞机安排降落时间
// time为上一架飞机降落的时间
bool backstracking(int u,int time)
{
    if(u==n) // 如果所有飞机都已尝试安排降落，则返回true
        return true;
    for(int i=0;i<n;i++) // 遍历所有飞机
    {
        // 如果当前飞机未降落且当前时间加上盘旋时间大于等于上一架飞机降落的时间，则尝试为其安排降落
        if(st[i]==0&&p[i].dao+p[i].pan>=time)
        {
            st[i]=1; // 标记当前飞机为已安排降落
            int t=max(time,p[i].dao)+p[i].luo; // 计算当前飞机降落完成的时间
            if(backstracking(u+1,t)) // 递归尝试为下一架飞机安排降落时间
                return true; // 如果能为所有飞机安排降落，则返回true
            st[i]=0; // 回溯，撤销当前飞机的降落安排
        }
    }
    return false; // 如果不能为所有飞机安排降落，则返回false
}

int main()
{
    cin>>t; // 输入测试数据组数
    while(t--) // 遍历每组测试数据
    {
        cin>>n; // 输入每组数据中的飞机数量
        for(int i=0;i<n;i++)
        {
            // 输入每架飞机的到达时间、盘旋时间和降落时间
            cin>>p[i].dao>>p[i].pan>>p[i].luo;
        }
        memset(st,0,sizeof(st)); // 初始化标记数组，所有飞机初始状态标记为未降落
        // 尝试为所有飞机安排降落，如果可以，则输出"YES"，否则输出"NO"
        if(backstracking(0,0)) cout<<"YES"<<endl;
        else cout<<"NO"<<endl;
    }
    return 0; // 程序结束
}
