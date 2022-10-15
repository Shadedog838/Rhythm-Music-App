from dataclasses import dataclass
import datastruct as ds
import os
import pandas
from threading import Thread


@dataclass
class Data:
    genre_list: list()
    songs_dict: ds.SongList
    album_dict: ds.AlbumList
    artist_list: list()

    def __init__(self) -> None:
        self.artist_list = []
        self.album_dict = ds.AlbumList()
        self.songs_dict = ds.SongList()
        self.genre_list = []
        self.open_and_load_file()

    def load_genre(self,cwd: str):
        path = cwd + "/data/genre.csv"
        pd = pandas.read_csv(path)
        self.genre_list = list(pd['name'])


    def load_songs(self,cwd: str):
        path = cwd + "/data/songs.csv"
        pd = pandas.read_csv(path)
        for index, row in pd.iterrows():
            self.songs_dict.addto(row['title'], ds.Song(row["title"], row["album name"], row["length"], row["artist name"], row['genre'], row['release date']))


    def load_artist(self,cwd: str):
        path = cwd + "/data/artists.csv"
        pd = pandas.read_csv(path)
        self.artist_list = list(pd["name"])


    def load_album(self,cwd: str):
        path = cwd + "/data/album.csv"
        pd = pandas.read_csv(path)
        for index, row in pd.iterrows():
            self.album_dict.addto(row['title'], ds.Album(
                row["title"], row["release date"], row["artist name"], row['genre']))


    def open_and_load_file(self):
        cwd = os.getcwd()
        threads = []
        threads.append(Thread(target= self.load_genre, args= (cwd,)))
        threads.append(Thread(target= self.load_artist, args=(cwd,)))
        threads.append(Thread(target= self.load_album, args= (cwd,)))
        threads.append(Thread(target= self.load_songs, args=(cwd,)))
        for thread in threads:
            thread.start()
        
        for thread in threads:
            thread.join()

def main():
    data = Data()
    data.open_and_load_file()


if __name__ == "__main__":
    main()