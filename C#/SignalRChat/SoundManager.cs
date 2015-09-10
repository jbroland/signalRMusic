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
          soundDico.Add(id,new Sound());
          return id;
      }

      public void modifyFrequency(string id, int f)
      {
          soundDico[id] = new Sound(f);
      }

      public string convertInJSON()
      {
          StringBuilder json;
          json = json.Append("[");
          foreach (var key in soundDico)
          {
              json.Append("{id: " + key + ", f: " + soundDico[key].frequency.ToString() + "}," );
          }
          json = json.Append("]");

          return json.ToString();
      }

  }
}