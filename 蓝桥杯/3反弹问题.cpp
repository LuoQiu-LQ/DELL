#include <bits/stdc++.h>
using namespace std;
//反弹问题
int main() {
    int a = 2*343720/15;
    int b = 2*233333/17;
    int i = 1;
    while(i*a%b!=0){
        i++;
    }
    double n = i*a;
    double s = n*sqrt(pow(15, 2)+pow(17, 2));
    cout<<fixed<<setprecision(2)<<s<<endl;
    return 0;
}
