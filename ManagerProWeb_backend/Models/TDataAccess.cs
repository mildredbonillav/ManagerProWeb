using System.Data;
using Microsoft.Data.SqlClient;

namespace ManagerProWeb.Models
{
    public class TDataAccess
    {
        SqlConnection _Conexion;
        public SqlCommand _Command;
        SqlDataAdapter _Adapter;
        SqlTransaction _Transaction;
        string _Mensaje_Error;

        public TDataAccess(string conexionString)
        {
            _Conexion = new SqlConnection(conexionString);
            _Command = new SqlCommand();
            _Adapter = new SqlDataAdapter();
            _Transaction = null!;
            _Mensaje_Error = "";
        }

        public string TransactionBegin()
        {
            try
            {
                _Mensaje_Error = OpenConnection();
                if (!string.IsNullOrEmpty(_Mensaje_Error.Trim()))
                    throw new ArgumentException(_Mensaje_Error);

                _Transaction = _Conexion.BeginTransaction();
                return "";
            }
            catch (Exception ex)
            {
                CloseConnection();
                return ex.Message;
            }
        }

        public string TransactionCommit()
        {
            try
            {
                _Transaction.Commit();
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            finally
            {
                CloseConnection();
            }
        }

        public string TransactionRollback()
        {
            try
            {
                _Transaction.Rollback();
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            finally
            {
                CloseConnection();
            }
        }

        public string OpenConnection()
        {
            try
            {
                if (_Conexion.State == ConnectionState.Closed)
                    _Conexion.Open();
                return "";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public string CloseConnection()
        {
            try
            {
                if (_Conexion.State == ConnectionState.Open)
                    _Conexion.Close();
                return "";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public string GetDataset(string tablename, string query, ref DataSet datos)
        {
            try
            {
                _Command.CommandText = query;
                _Command.Connection = _Conexion;
                _Command.CommandTimeout = 0;
                _Adapter.SelectCommand = _Command;

                _Mensaje_Error = OpenConnection();
                if (!string.IsNullOrEmpty(_Mensaje_Error.Trim()))
                    throw new ArgumentException(_Mensaje_Error);

                _Adapter.Fill(datos, tablename);
                return "";
            }
            catch (Exception e)
            {
                return e.Message;
            }
            finally
            {
                _Conexion.Close();
            }
        }

        public DateTime GetDateValue(string query)
        {
            try
            {
                _Command.Connection = _Conexion;
                _Command.CommandText = query;
                _Command.Transaction = _Transaction;
                return Convert.ToDateTime(_Command.ExecuteScalar());
            }
            catch
            {
                return DateTime.Now;
            }
        }

        public string ExecuteQuery(string query)
        {
            try
            {
                _Command.Connection = _Conexion;
                _Command.CommandText = query;
                _Command.CommandTimeout = 0;
                _Command.Transaction = _Transaction;
                _Command.CommandType = CommandType.Text;
                _Command.ExecuteNonQuery();
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
