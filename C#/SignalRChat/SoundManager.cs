using System.Collections.Generic;
using Microsoft.AspNet.SignalR;
using System.Text;
namespace SignalRChat
{
    public interface ISoundManager
    {
        string addSound( );
        void modifyFrequency(string id, int f);
        string convertInJSON();
        void resetSounds();
    }

    public  class SoundManager : ISoundManager
    {

      private static SoundManager _manager;
      private Dictionary<string, Sound> soundDico;
      private Dictionary<string, Wave> waveDico;
      private static readonly object locker = new object();
      private const int MaxSound = 100;
      
      private SoundManager()
      {
          soundDico=new Dictionary<string, Sound>();
          waveDico=new Dictionary<string, Wave>();

      }

      public static SoundManager Manager
      {
          get
          {
              lock (locker)
              {
                  if (_manager == null)
                  {
                      _manager = new SoundManager();
                  }
                  return _manager;
              }
          }
      }


      public string addSound( )
      {
          var id = "sound" + soundDico.Count;
          if (soundDico.Count<=MaxSound)
            soundDico.Add(id,new Sound());
          return id;
      }

      public void modifyFrequency(string id, int f)
      {
          soundDico[id].frequency = f;
      }

      public void modifyType(string id, string type)
      {
          soundDico[id].type = type;
      }

      public string convertInJSON()
      {
          StringBuilder json = new StringBuilder();
          json = json.Append("[");
          bool firstElement = true;
          foreach (var key in soundDico)
          {
              if (!firstElement)
              {
                  json = json.Append(",");
              }
              else
              {
                  firstElement = false;
              }

              json = json.Append("{\"id\": \"" + key.Key + "\", \"f\": \"" + soundDico[key.Key].frequency.ToString() + "\"}");
          }
          
          json = json.Append("]");

          return json.ToString();
      }

      public void resetSounds()
      {
          soundDico.Clear();
      }

        public string AddWave()
        {
            var id = "wave" + waveDico.Count;
            if (waveDico.Count <= MaxSound)
                waveDico.Add(id, new Wave());
            return id;
        }


      
    }
}