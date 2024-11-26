function UsuariosDAO(connection){
    console.log('objeto carregado');
    this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("usuarios", function(err, collection){
            collection.insert(usuario);

            mongoclient.close();
        });
    });
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("usuarios", function(err, collection){
            collection.find(usuario).toArray(function(err, result){
                console.log(result);

                if(result[0] != undefined){
                    req.session.autorizado = true;

                    req.session.usuario = result[0].usuario;    
                    req.session.casa = result[0].casa;
                }
                if(req.session.autorizado){
                    res.redirect("jogo")
                    //res.send('Usuário foi encontrado no banco de dados');
                } else{
                    res.render('index', { validacao: {} });
                    //res.send('Usuário não foi encontrado no banco de dados')
                }
            });

            mongoclient.close();
        });
    });

}

module.exports = function(){
    return UsuariosDAO;
}
    
