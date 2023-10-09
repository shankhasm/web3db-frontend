#include <iostream>
#include<string>
#include<fstream>
#include <cstring>
#include <sys/socket.h>
#include <netinet/in.h>
#include <pqxx/pqxx> // PostgreSQL library
#include <ipfs/client.h> // IPFS library
#include <nlohmann/json.hpp>
#include <cstdlib>

#ifdef _WIN32
    #include <Winsock2.h>
    typedef int socklen_t;
    #pragma comment(lib, "ws2_32.lib")
#else
    #include <unistd.h>
    #define closesocket close
#endif

using namespace pqxx;
using namespace ipfs;


bool doesTableExist(pqxx::connection& conn, const std::string& tableName) {
    try {
        pqxx::work txn(conn);
        std::string query = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '" + tableName + "')";
        pqxx::result result = txn.exec(query);
        bool exists = result[0][0].as<bool>();
        txn.commit();
        return exists;
    } catch (const std::exception& e) {
        std::cerr << "Error checking table existence: " << e.what() << std::endl;
        return false;
    }
}


int exe_query(std::string query)
{
    std::cout<<query.substr(0,6)<<"Hello"<<std::endl;
    try{
        // Connect to the PostgreSQL database
        connection C("dbname = postgres user = postgres password = OPF327@kb hostaddr = 127.0.0.1 port = 5432");

        if (C.is_open()) {
         std::cout << "Opened database successfully: " << C.dbname() << std::endl;
        } 
        else {
            std::cout << "Can't open database" << std::endl;
            return 1;
        }

        std::string tableName;

        tableName="company";

        bool b= doesTableExist(C, tableName);

        if(b==false)
        {
            std::string psqlCommand = "psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f /Users/Shankha/.ipfs/company.sql";
            int result = std::system(psqlCommand.c_str());
            if (result == 0) {
                std::cout << "Table recreated successfully!" << std::endl;
            } 
            else {
                std::cerr << "Failed to recreate table" << std::endl;
                // Additional error handling, if needed.
            }

        }
    
        if(query.substr(0,6)=="SELECT")
            {
                work W(C);
                result R= W.exec(query);
                W.commit();

                for (const auto& row : R) 
                {
                    for (const auto& field : row) {
                    std::cout << field.c_str() << " ";
                    }
                    std::cout << std::endl;
                }
                std::cout<< "Operation done successfully" << std::endl; 
            }
            else
            {
                work W(C);
                W.exec(query);
                W.commit();
            }
            if (query.substr(0,6)== "UPDATE" || query.substr(0,6)== "INSERT" || query.substr(0,6)== "DELETE")
            {
                // pqxx::work txn(C); // Begin a transaction

                // std::string tableName = "company";
                // query = "SELECT row_to_json(t) FROM (SELECT * FROM " + tableName + ") t";
                // pqxx::result result = txn.exec(query);

                // // Convert the result to a JSON array
                // Json jsonArray;
                // for (const auto& row : result)
                // {
                //     Json rowData = Json::parse(row[0].as<std::string>());
                //     jsonArray.push_back(rowData);
                // }

                // // Write the JSON array to a file
                // std::string outputFilePath = "/Users/Shankha/.ipfs/company.json";
                // std::ofstream outputFile(outputFilePath);
                // if (outputFile.is_open())
                // {
                //     outputFile << jsonArray.dump(2); // 2 for pretty formatting
                //     outputFile.close();
                //     std::cout << "JSON file created successfully!" << std::endl;
                // }
                // else
                // {
                //     std::cerr << "Failed to create JSON file!" << std::endl;
                // }


                std::string dumpCommand = "pg_dump -U postgres -d postgres > /Users/Shankha/.ipfs/company.sql";
                int result = std::system(dumpCommand.c_str());
                if (result == 0) {
                    std::cout << "SQL dump file created successfully!" << std::endl;
                } 
                else {
                    std::cerr << "Failed to create SQL dump file" << std::endl;
                }



                
                //Set file path & CLI command
                std::string filename = "~/.ipfs/company.sql";
                std::string command = "ipfs add " + filename;
                //Buffer to hold IPFS command output
                std::array<char, 128> buffer;
                std::string Res;

                // Call the bash command
                FILE* pipe = popen(command.c_str(), "r");
                if (!pipe) {
                    std::cerr << "Error executing bash command... not good" << std::endl;
                } //if
                //Read output to string type
                while (fgets(buffer.data(), buffer.size(), pipe) != nullptr) {
                    Res = buffer.data();
                } //while

                // Close the pipe
                pclose(pipe);

                // Print the captured output
                std::cout << "Pin command out: \n" << Res << std::endl;
            }
        }
    catch (const std::exception& e) {
        std::cerr << "Error executing query: " << e.what() << std::endl;
    }

    return 1;
}


int main() {
    #ifdef _WIN32
        WSADATA wsaData;
        if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
            std::cerr << "Failed to initialize Winsock." << std::endl;
            return 1;
        }
    #endif
        
    int serverSocket, clientSocket;
    struct sockaddr_in serverAddr, clientAddr;
    socklen_t addrLen = sizeof(clientAddr);
    char buffer[1024] = {0};

    // Create a socket
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket == -1) {
        std::cerr << "Failed to create socket." << std::endl;
        return 1;
    }

    // Bind the socket to a port
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(5000); // Replace with your desired port number
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    memset(serverAddr.sin_zero, '\0', sizeof(serverAddr.sin_zero));

    if (bind(serverSocket, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) == -1) {
        std::cerr << "Failed to bind." << std::endl;
        return 1;
    }

    // Listen for incoming connections
    if (listen(serverSocket, 1) == -1) {
        std::cerr << "Failed to listen." << std::endl;
        return 1;
    }

    while (true) {
        // Accept a connection from a client
        clientSocket = accept(serverSocket, (struct sockaddr *)&clientAddr, &addrLen);
        if (clientSocket == -1) {
            std::cerr << "Failed to accept connection." << std::endl;
            return 1;
        }

        // Receive data from the client
        int bytesRead;
        while ((bytesRead = recv(clientSocket, buffer, sizeof(buffer), 0)) > 0) {
            std::cout << "Received data from client: " << buffer << std::endl;

            std::string query=buffer;
            exe_query(query);

            memset(buffer, 0, sizeof(buffer)); // Clear the buffer for the next message

        }

        if (bytesRead == -1) {
            std::cerr << "Failed to receive data." << std::endl;
        }

        // Close the client socket (Note: The server socket remains open for further connections)
        closesocket(clientSocket);
    }

    #ifdef _WIN32
        WSACleanup();
    #endif  

    return 0;
}