//2017 年龄问题

#include <iostream>
#include <cstring>
#include <algorithm> 
using namespace std;

bool isunique(int n1 ,int n2)
{
    string s = to_string(n1) + to_string(n2); //to_sting 将数字转换为字符串
    if (s.length() != 10) return false;
    sort(s.begin(), s.end());
    for (int i = 0; i < 10; i++)
    {
        if(s[i] != '0' + i) return false;
    }
    return true;
}

int main()
{
	for(int i=10;i<30;i++)
	{
		int cube = (int)i*i*i;
		int fourth = (int)i*i*i*i;
		if(cube >= 1000 && cube < 10000 && fourth>=100000 && fourth<1000000)
		{
            if(isunique(cube,fourth))
            {
                cout<<i<<" "<<cube<<" "<<fourth<<endl;
            }
		}
	}
	return 0;
 } 