const Pedido = require('../models/Pedido');

exports.nuevoPedido = async (req, res, next) => {
    const pedido = new Pedido(req.body);
    try {
        await pedido.save();
        res.json({ mensaje: 'Se agregó un nuevo pedido' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Muestra todos los pedidos
exports.mostrarPedidos = async (req, res, next) => {
    try {
        const pedidos = await Pedido.find({})
            .populate('cliente', '-password')
            .populate('pedido.producto');
        res.json(pedidos);
    } catch (error) {
        console.log(error);
        next();
    }
};

// Muestra un pedido por su ID
exports.mostrarPedido = async (req, res, next) => {
    try {
        const pedido = await Pedido.findById(req.params.idPedido)
            .populate('cliente', '-password')
            .populate('pedido.producto');

        if(!pedido) {
            res.json({mensaje : 'Ese pedido no existe'});
            return next();
        }
        res.json(pedido);
    } catch (error) {
        console.log(error);
        next();
    }
}; 

// Actualizar el pedido via ID
exports.actualizarPedido = async (req, res, next) => {
    try {
        const pedido = await Pedido.findOneAndUpdate({_id: req.params.idPedido}, req.body, {new: true})
            .populate('cliente', '-password')
            .populate('pedido.producto');

        res.json(pedido);
    } catch (error) {
        console.log(error);
        next();
    }
};

// Elimina un pedido por su ID
exports.eliminarPedido = async (req, res, next) => {
    try {
        await Pedido.findByIdAndDelete(req.params.idPedido);
        res.json({ mensaje : 'El pedido se ha eliminado' });
    } catch (error) {
        console.log(error);
        next();
    }
};

// Muestra todos los pedidos de un cliente específico
exports.mostrarPedidosCliente = async (req, res, next) => {
    try {
        // Buscamos todos los pedidos que pertenecen al cliente especificado en los parámetros de la solicitud
        const pedidos = await Pedido.find({ cliente: req.params.idCliente })
            // Populamos el campo 'cliente' del pedido, excluyendo el campo 'password'
            .populate('cliente', '-password')
            // Populamos el campo 'producto' dentro del array 'pedido'
            .populate('pedido.producto');

        // Enviamos la respuesta en formato JSON con los pedidos obtenidos
        res.json(pedidos);
    } catch (error) {
        // Si ocurre un error, lo registramos en la consola
        console.log(error);
        // Pasamos el control al siguiente middleware con el error
        next();
    }
};
