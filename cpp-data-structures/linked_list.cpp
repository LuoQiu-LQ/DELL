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
    
    // 测试链表操作
    cout << "Appending 1, 2, 3:" << endl;
    list.append(1);
    list.append(2);
    list.append(3);
    list.printList();
    
    cout << "\nPrepending 0:" << endl;
    list.prepend(0);
    list.printList();
    
    cout << "\nDeleting 2:" << endl;
    list.deleteNode(2);
    list.printList();
    
    return 0;
}
