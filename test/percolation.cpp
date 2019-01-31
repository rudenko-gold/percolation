#include <iostream>
#include <cmath>
#include <vector>
#include <algorithm>
#include <chrono>
#include <stdlib.h>
#include <string>
#include <fstream>

using std::vector;
using std::cout;
using std::cin;
using namespace std::chrono;

vector<int> rank;
vector<int> parent;
vector<vector<int>> data;

int size = 5;

vector<vector<vector<int>>> data_history;

int window_size = 720;

void add_to_set(int v) {
    parent[v] = v;
    rank[v] = 0;
}

void make_set(int len) {
    parent.clear();
    parent.resize(len);
    rank.clear();
    rank.resize(len);
    for (int i = 0; i < len; ++i) {
        add_to_set(i);
    }
}

int find_set(int v) {
    if (v == parent[v])
        return v;

    return parent[v] = find_set(parent[v]);
}

void union_sets(int a, int b) {
    a = find_set(a);
    b = find_set(b);
    if (a != b) {
        if (rank[a] < rank[b]) {
            int t = a;
            a = b;
            b = t;
        }
        parent[b] = a;
        if (rank[a] == rank[b])
            ++rank[a];
    }
}


bool connected(int p, int q) {
    return find_set(p) == find_set(q);
}


bool percolate(int v, int size) {
    int check = false;
    for (int i = size * size; i > size * size - size; i--) {
        check = check || connected(v, i);
    }
    return check;
}

int generate_percolation() {
    srand(time(0));
    int open = 0;
    make_set(size * size + 2);
    data.clear();
    data.resize(size); // 0 - block, 1 - empty, 2 - percolated
    for (int i = 0; i < size; ++i) {
        data[i].clear();
        data[i].resize(size);
        for (int j = 0; j < size; ++j) {
            data[i][j] = 0;
        }
    }

    for (int i = 1; i <= size; ++i) {
        union_sets(0, i);
    }

   // data_history.clear();

    //data_history.push_back(data);
    
    while (!percolate(0, size)) {
        int rand, rand_i, rand_j;
        rand = (std::rand() * 1.0 / RAND_MAX) * size * size + 1;
        //rand = (std::rand() % (size * size)) + 1;
        rand_i = floor(rand / size);
        if (rand % size == 0) {
            rand_i--;
        }
        rand_j = (rand % size) - 1;
        if (rand_j == -1) {
            rand_j = size - 1;
        }

        int i = rand_i;
        int j = rand_j;
        if (rand > size * size) {
            continue;
        }
        if (data[rand_i][rand_j] != 0) {
            continue;
        }
        /*
        for (int i = 0; i < 5; i++) {
            for (int j = 0; j < 5; j++) {
                cout << data[i][j] << " ";
            }
            cout << std::endl;
        }*/
        /*
        for (int i = 1; i < 26; i++) {
            if ((i - 1) % size == 0)
                cout << std::endl;
            cout << parent[i] << " ";
        }*/
        //cout << std::endl;
        //cout << rand_i << " " << rand_j << " "<<  int(find_set(0) == find_set(size * size + 1)) << std::endl;
        data[rand_i][rand_j] = 1;
        open++;

        if (rand_i == 0) {
            if (rand_j == 0) {
                if (data[i][j + 1] != 0) {
                    union_sets(rand, rand + 1);
                }
                if (data[i + 1][j] != 0) {
                    union_sets(rand, rand + size);
                }
            }
            else if (rand_j == size - 1) {
                if (data[i][j - 1] != 0) {
                    union_sets(rand, rand - 1);
                }
                if (data[i + 1][j] != 0) {
                    union_sets(rand, rand + size);
                }
            }
            else {
                if (data[i][j + 1] != 0) {
                    union_sets(rand, rand + 1);
                }
                if (data[i][j - 1] != 0) {
                    union_sets(rand, rand - 1);
                }
                if (data[i + 1][j] != 0) {
                    union_sets(rand, rand + size);
                }
            }
        }
        else if (rand_i == size - 1) {
            if (rand_j == 0) {
                if (data[i - 1][j] != 0) {
                    union_sets(rand, rand - size);
                }
                if (data[i][j + 1] != 0) {
                    union_sets(rand, rand + 1);
                }
            }
            else if (rand_j == size - 1) {
                if (data[i - 1][j] != 0) {
                    union_sets(rand, rand - size);
                }
                if (data[i][j - 1] != 0) {
                    union_sets(rand, rand - 1);
                }
            }
            else {
                if (data[i - 1][j] != 0) {
                    union_sets(rand, rand - size);
                }
                if (data[i][j - 1] != 0) {
                    union_sets(rand, rand - 1);
                }
                if (data[i][j + 1] != 0) {
                    union_sets(rand, rand + 1);
                }
            }
        }
        else {
            if (rand_j == 0) {
                if (data[i][j + 1] != 0) {
                    union_sets(rand, rand + 1);
                }
                if (data[i - 1][j] != 0) {
                    union_sets(rand, rand - size);
                }
                if (data[i + 1][j] != 0) {
                    union_sets(rand, rand + size);
                }
            }
            else if (rand_j == size - 1) {
                if (data[i][j - 1] != 0) {
                    union_sets(rand, rand - 1);
                }
                if (data[i - 1][j] != 0) {
                    union_sets(rand, rand - size);
                }
                if (data[i + 1][j] != 0) {
                    union_sets(rand, rand + size);
                }
            }
            else {
                if (data[i][j - 1] != 0) {
                    union_sets(rand, rand - 1);
                }
                if (data[i - 1][j] != 0) {
                    union_sets(rand, rand - size);
                }
                if (data[i][j + 1] != 0) {
                    union_sets(rand, rand + 1);
                }
                if (data[i + 1][j] != 0) {
                    union_sets(rand, rand + size);
                }
            }

        }

        //data_history.push_back(data);
    }
    return open;
}

void view() {
    std::ofstream fout;
    fout.open("percolated_table.txt");
    fout << size << std::endl;
    for (int i = 0; i < data.size(); i++) {
        for (int j = 0; j < data.size(); j++) {
            if (data[i][j] == 0) {
                cout << 0 << " ";
                fout << 0 << " ";
            }
            else if (data[i][j] == 1) {
                int s = i * size;
                s += j + 1;
                if (find_set(s) == find_set(0)) {
                    cout << "*" << " ";
                    fout << "*" << " ";
                }
                else {
                    cout << 1 << " ";
                    fout << 1 << " ";
                }
            }
            else {
                cout << "* ";
                fout << "* ";
            }
        }
        cout << std::endl;
        fout << std::endl;
    }
}

int man() {
    while (true) {
        system("cls");
        cout << "Enter the size of square: ";
        std::string input;
        cin >> input;
        if (input[0] == '0') {
            continue;
        }
        bool valid = true;
        for (int i = 0; i < input.size(); i++) {
            if (!(input[i] >= '0' && input[i] <= '9')) {
                valid = false;
            }
        }
        if (!valid)
            continue;

        size = 0;
        for (int i = 0; i < input.size(); i++) {
            size += (input[i] - '0');
            size *= 10;
        }
        size /= 10;

        if (size > 0 && size < 1000) {
            break;
        }
    }
    int open;
    high_resolution_clock::time_point t1 = high_resolution_clock::now();
    open = generate_percolation();
    high_resolution_clock::time_point t2 = high_resolution_clock::now();
    auto duration = duration_cast<microseconds>(t2 - t1).count();
    cout << "\nTime used: " << duration / 1000.0 << " ms\n\n";
    cout << "0 - blocked, 1 - empty, * - empty and full" << std::endl;

    view();
    cout << std::endl;
    cout << "Open sides amount: " << open << std::endl;
    cout << "Value of p = " << (open * 1.0) / (size * size) << std::endl;
    system("pause");
    return 0;
}