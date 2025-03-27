#include <iostream>
using namespace std;

// 链表节点结构体
struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

// 链表类
class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}
    
    // 在链表末尾插入节点
    void append(int val) {
        Node* newNode = new Node(val);
        if (!head) {
            head = newNode;
            return;
        }
        Node* current = head;
        while (current->next) {
            current = current->next;
        }
        current->next = newNode;
    }
    
    // 在链表头部插入节点
    void prepend(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }
    
    // 删除指定值的节点
    void deleteNode(int val) {
        if (!head) return;
        
        if (head->data == val) {
            Node* temp = head;
            head = head->next;
            delete temp;
            return;
        }
        
        Node* current = head;
        while (current->next && current->next->data != val) {
            current = current->next;
        }
        
        if (current->next) {
            Node* temp = current->next;
            current->next = current->next->next;
            delete temp;
        }
    }
    
    // 打印链表
    void printList() {
        Node* current = head;
        while (current) {
            cout << current->data << " -> ";
            current = current->next;
        }
        cout << "NULL" << endl;
    }
    
    // 析构函数释放内存
    ~LinkedList() {
        Node* current = head;
        while (current) {
            Node* next = current->next;
            delete current;
            current = next;
        }
    }
};

int main() {
    LinkedList list;
    int choice, value;
    
    while (true) {
        cout << "\n链表操作菜4单：" << endl;
        cout << "1. 在末尾插入节点" << endl;
        cout << "2. 在头部插入节点" << endl;
        cout << "3. 删除节点" << endl;
        cout << "4. 打印链表" << endl;
        cout << "5. 退出" << endl;
        cout << "请输入你的选择: ";
        cin >> choice;
        
        switch (choice) {
            case 1:
                cout << "请输入要插入的值: ";
                cin >> value;
                list.append(value);
                break;
            case 2:
                cout << "请输入要插入的值: ";
                cin >> value;
                list.prepend(value);
                break;
            case 3:
                cout << "请输入要删除的值: ";
                cin >> value;
                list.deleteNode(value);
                break;
            case 4:
                list.printList();
                break;
            case 5:
                return 0;
            default:
                cout << "无效的选择，请重试。" << endl;
        }
    }
}
