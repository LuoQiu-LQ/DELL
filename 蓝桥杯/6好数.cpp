#include<vector>
#include<iostream>
using namespace std;
int Count(int n)
{
	int x = 0;//位数
	while (n != 0)
	{
		n /= 10;
		x++;
	}
	return x;
}
bool HaoShu(int n, int count)
{
	vector<int>v;
	//数字n的各位数字从后往前存入到vector当中
	while (n != 0)
	{
		int c = n % 10;
		v.push_back(c);
		n /= 10;
	}
	//判断奇数位是奇数，偶数位是偶数 
	//定义两个指针，一个指向1，一个指向2，往后走，如果奇数位有一个奇数 
	// 或者偶数位有一个偶数，那么不是好数，否则是好数 
	for (int i = 1; i <= count ; i += 2) 
	{
		if (v[i - 1] % 2 == 0 ) 
		{
			return false;   
		}
	}
	if (count >= 2)   
	{
		for (int j = 2;j <= count;j += 2)   
		{
			if (v[j - 1] % 2 != 0)   
				return false;   
		}
	}
	return true;   
}
int main()   
{
	int n;   
	cin >> n;     
	int ans = 0;      
	for (int i = 1; i <= n; i++)      
	{
		int count = Count(i);      
		if (HaoShu(i, count))      
			ans++;      
	}
	cout << ans << endl;      
}


