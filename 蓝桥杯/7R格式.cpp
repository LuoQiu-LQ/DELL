#include<bits/stdc++.h>
using namespace std;

// 乘法函数，用于将向量 a 中的每个元素乘以整数 n，并返回结果向量
vector<int> mul(vector<int> a,int n)
{
	vector<int> c; // 结果向量
	int t=0; // 用于累计进位
	for(int i=0;i<a.size()||t;i++)
	{
		if(i<a.size()) t+=a[i]*n; // 计算当前位与 n 的乘积加上之前的进位
		c.push_back(t%10); // 将乘积的个位数加入结果向量
		t/=10; // 更新进位
	}
	return c; // 返回结果向量
} 

// 加法函数，用于将向量 b 的每个元素与整数 n 相加，并返回结果向量
vector<int> sum(vector<int> b,int n)
{
	vector<int> c; // 结果向量
	int t=0; // 用于累计进位
	for(int i=0;i<b.size();i++)
	{
		t+=b[i]; // 加上当前位的值
		if(n) t+=n%10; // 如果 n 不为零，则加上 n 的当前位
		c.push_back(t%10); // 将和的个位数加入结果向量
		t/=10; // 更新进位
		n/=10; // 更新 n，移动到下一位
	}
	if(t) c.push_back(t); // 如果最后还有进位，加到结果向量的末尾
	return c; // 返回结果向量
}

int main()
{
    int n; // 转换参数 n
    string s; // 待转换的浮点数 d 作为字符串
    cin>>n>>s; // 从输入读取 n 和 s
    string t; // 用于存储去掉小数点后的数字字符串
    int k=0; // 小数点后数字的个数
    // 移除小数点，并计算 k
    for(int i=0;i<s.size();i++)
    {
        if(s[i]!='.')
            t+=s[i];
        else
            k=i; 
    }
    k=t.size()-k; // 计算小数点后的位数
    vector<int> a; // 存储数字的向量，每个元素是一位数字
    // 将字符串 t 的数字转换为向量 a
    for(int i=t.size()-1;i>=0;i--)
        a.push_back(t[i]-'0');    
    // 将 a 乘以 2^n
    for(int i=1;i<=n;i++)
        a=mul(a,2);
    reverse(a.begin(),a.end()); // 反转结果向量，以便从最高位开始处理
    int p=a[a.size()-k]; // 获取可能需要四舍五入的位
    if(p>=5) // 如果需要四舍五入
    {
    	vector<int> b;
    	// 构造需要增加 1 的向量 b
    	for(int i=a.size()-1-k;i>=0;i--)
    	{
    		b.push_back(a[i]);
		}
		b=sum(b,1); // 对 b 加 1
		for(int i=b.size()-1;i>=0;i--)
			cout<<b[i]; // 输出结果
    }
    else // 如果不需要四舍五入
    {
    	for(int i=0;i<a.size()-k;i++)
    		cout<<a[i]; // 直接输出结果
	}
    return 0;
}
