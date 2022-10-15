from dataclasses import dataclass


@dataclass
class Artist:
    artist_name:str

    def __init__(self, name:str, id:str, genre:set()) -> None:
       self.artist_name = name
    def __str__(self) -> str:
        return f"'{self.artist_name}'"
    

@dataclass
class Album:
    """
        Class stores album information
        @params album_name: name of the album
        @params artist: name of the artist to whom the ablum belong to  
        @params size: no of songs in the album
        @params genre: genre for the ablum "STORED AS A SET TYPE
    """
    album_name:str
    release_data:str
    artist :str 
    size: int
    genre:set()

    def __init__(self, name:str,release_date:str, artist:str, genre:set()) -> None:
        self.album_name  =name
        self.artist = artist
        self.release_data = release_date
        self.genre = genre
        
    
    def get_artist(self):
        return self.artist
    def get_album_name(self):
        return self.album_name 
    def get_genre(self):
        return self.genre
    def get_release_data(self):
        return self.release_data
    def __str__(self) -> str:
       return f"{self.album_name}, '{self.release_data}',{self.artist}, '{self.genere}'" 


@dataclass
class Song:
    """
        Class stores song information
        @params title: name of the song 
        @params album: name of the album the song belongs to 
        @params artist: name of the artist to whom the ablum belong to  
        @params length: length of the song in (ms) 
        @params genre: genre for the ablum "STORED AS A LIST TYPE
    """
    title: str
    album:str 
    lenght:int
    genre:list()
    artist:str
    release_date:str

    def __init__(self, song_name:str, album:str, length:str, artist:str, genre:list(), date:str) -> None:
        self.album=album
        self.lenght = length
        self.title= song_name
        self.genre = genre
        self.artist = artist
        self.release_date = date

    def get_title(self):
        return self.title 
    def get_album(self):
        return self.album
    def get_artist(self):
        return self.artist
    def get_release_date(self):
        return self.release_date
    def get_length(self):
        return self.lenght
    def get_genre(self):
        return self.genre

    def add_genre(self,genre:list()):
        self.genre = genre
    def get_list(self):
        return [self.genre, self.lenght, self.title, self.release_date, self.album, self.artist] 
    def __str__(self) -> str:
        return f"'{self.genre}', {self.lenght}, {self.title}, '{self.release_date}', {self.album}, '{self.artist}'"

@dataclass
class ArtistSet:
    artistSet:dict[str, Artist]
    def __init__(self) -> None:
        self.artistSet = {}
    def addto(self, key:str, value:Song):
        self.artistSet[key] = value
    
    
@dataclass
class AlbumList:
    """
        stores all the album in a dictionary in Key value pairs
        key: album title
        value: the album object from Album class
    """

    albumDict:dict[str,Album]

    def __init__(self) -> None:
        self.albumDict= dict()

    def add_album_collection(self, key, value):
        self.albumDict[key] = value

    def get_album(self, albumName):
        '''
            returns an album object for the given key 
        '''
        return self.albumDict[albumName] 

    def get_artist(self, albumeName):
        return self.albumDict[albumeName].get_artist()

    def get_album_collection(self):
        return self.albumDict

    def get_genre(self,albumname):
        return list(self.albumDict[albumname].get_genre())

    def addto(self, key:str, value:Song):
        self.albumDict[key] = value

@dataclass
class SongList:
    songDict:dict[str, Song]
    def __init__(self) -> None:
        self.songDict = {}
    def get_songList(self):
        return self.songDict
    def addto(self, key:str, value:Song):
        self.songDict[key] = value
