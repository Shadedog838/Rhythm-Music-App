from ast import Load
from dataclasses import dataclass
from sqlite3 import connect
import psycopg2
from sshtunnel import SSHTunnelForwarder
import password
import LoadData

def add_to_database():
        try:
            with SSHTunnelForwarder(('starbug.cs.rit.edu', 22),
                                ssh_config_file=None,
                                ssh_host_key=None,
                                ssh_username=password.db_user,
                                ssh_password=password.db_password,
                                remote_bind_address=('localhost', 5432)) as server:
                server.start()
                print("SSH tunnel established")
                params = {
                    'database': password.data_base_name,
                    'user': password.db_user,
                    'password': password.db_password,
                    'host': 'localhost',
                    'port': server.local_bind_port
                }
                connection = psycopg2.connect(**params)
                databaseCursor = connection.cursor()

        except:
            print("Connection failed")


@dataclass
class ServerConnection:
    connection:any
    databaseCursor:any
    data:LoadData.Data
    
    def __init__(self) -> None:
        self.load_data()
        self.connect_to_server(None, None)

    def load_data(self):
        self.data = LoadData.Data()

    def connect_to_server(self,ssh_username, ssh_password):
    
        try:
            with SSHTunnelForwarder(('starbug.cs.rit.edu', 22),
                                ssh_config_file=None,
                                ssh_host_key=None,
                                ssh_username=password.db_user,
                                ssh_password=password.db_password,
                                remote_bind_address=('localhost', 5432)) as server:
                server.start()
                print("SSH tunnel established")
                params = {
                    'database': password.data_base_name,
                    'user': password.db_user,
                    'password': password.db_password,
                    'host': 'localhost',
                    'port': server.local_bind_port
                }
                self.connection = psycopg2.connect(**params)
                self.databaseCursor = self.connection.cursor()
                query = "INSERT INTO artist (name) VALUES (%s)"
                for name in self.data.artist_list:
                    self.databaseCursor.execute(query,(name,))
                self.commit_data()
                self.close_connection()

        except:
            print("Connection failed")


    def commit_data(self):
        self.connection.commit()

    def close_connection(self):
        self.connection.close()
    
    def parser(self,query:str, values):
        self.databaseCursor.execute(query,values)
        if query[0] == "SELECT":
            self.databaseCursor.fetchcall()
    
def main():
    connection = ServerConnection()
    #query = "INSERT INTO artist (name) VALUES (%s)"
    #for name in connection.data.artist_list:
    #    connection.parser(query,(name,))
    #connection.databaseCursor.close()
    #connection.close_connection()



if __name__ == "__main__":
    main()