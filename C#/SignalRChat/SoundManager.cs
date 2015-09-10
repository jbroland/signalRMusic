using System.Collections.Generic;
using Microsoft.AspNet.SignalR;
using System.Text;
namespace SignalRChat
{
  public  class SoundManager
  {

      private static SoundManager _manager;
      private Dictionary<string, Sound> soundDico;
      private static readonly object locker = new object();
      private const int MaxSound = 100;
      
      private SoundManager()
      {
          soundDico=new Dictionary<string, Sound>();

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
          soundDico[id] = new Sound(f);
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

  }
}