#include <iostream>
#include <fstream>
#include <vector>

char graph[1002][1002] = { };
int g_size;
int used[1002][1002] = { };

void dfs(int i, int j) {
    used[i][j] = 1;
    if (graph[i + 1][j] == '*' && used[i + 1][j] == 0) {
        dfs(i + 1, j);
    }
    if (graph[i - 1][j] == '*' && used[i - 1][j] == 0) {
        dfs(i - 1, j);
    }
    if (graph[i][j + 1] == '*' && used[i][j + 1] == 0) {
        dfs(i, j + 1);
    }
    if (graph[i][j - 1] == '*' && used[i][j - 1] == 0) {
        dfs(i, j - 1);
    }
}

int main() {
    std::ifstream fin;
    fin.open("percolated_table.txt");
    fin >> g_size;

    for (int i = 0; i < 1002; i++) {
        for (int j = 0; j < 1002; j++) {
            graph[i][j] = 0;
        }
    }

    for (int i = 1; i <= g_size; i++) {
        for (int j = 1; j <= g_size; j++) {
            fin >> graph[i][j];
        }
    }

    for (int j = 1; j <= g_size; j++) {
        if (graph[1][j] == '*' && !used[1][j]) {
            dfs(1, j);
        }
    }

    bool check = false;
    for (int j = 1; j <= g_size; j++) {
        if (used[g_size][j] == 1) {
            check = true;
        }
    }

    if (check) {
        std::cout << "Table is correct and percolated." << std::endl;
    } else {
        std::cout << "Table is uncorrect and not percolated." << std::endl;
    }
    system("pause");
    return 0;
}